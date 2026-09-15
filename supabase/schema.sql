-- =====================================================
-- Analytics: page_events table
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS page_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL CHECK (event_type IN ('page_view', 'outbound_click', 'contact_click')),
  page        TEXT,                    -- e.g. '/blog/my-post', '/work/project-name', '/'
  category    TEXT,                    -- 'home' | 'blog' | 'project' | 'about' | 'contact' | 'other'
  label       TEXT,                    -- outbound link href, or contact action label
  referrer    TEXT,
  user_agent  TEXT,
  duration_ms INTEGER,                 -- time-on-page in ms (sent on pagehide for page_view)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common dashboard queries
CREATE INDEX IF NOT EXISTS idx_page_events_created_at  ON page_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_event_type  ON page_events (event_type);
CREATE INDEX IF NOT EXISTS idx_page_events_category    ON page_events (category);
CREATE INDEX IF NOT EXISTS idx_page_events_page        ON page_events (page);

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "anon_insert" ON page_events;
DROP POLICY IF EXISTS "auth_select" ON page_events;

-- ANON role: INSERT only (tracking snippet uses the public anon key)
CREATE POLICY "anon_insert"
  ON page_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- AUTHENTICATED role: SELECT only (dashboard after GitHub OAuth login)
CREATE POLICY "auth_select"
  ON page_events
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- Helper view: daily_page_views (for fast chart queries)
-- =====================================================
CREATE OR REPLACE VIEW daily_page_views AS
SELECT
  DATE_TRUNC('day', created_at AT TIME ZONE 'UTC') AS day,
  category,
  COUNT(*) AS views,
  ROUND(AVG(duration_ms))::INTEGER AS avg_duration_ms
FROM page_events
WHERE event_type = 'page_view'
GROUP BY 1, 2
ORDER BY 1 DESC;

-- Grant SELECT on view to authenticated users
GRANT SELECT ON daily_page_views TO authenticated;
