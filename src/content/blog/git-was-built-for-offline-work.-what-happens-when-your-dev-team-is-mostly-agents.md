---
title: "Git Was Built for Humans. What Happens When Your Dev Team Is Mostly Agents?"
description: "What Anthropic's Scion, a server-first version control system built for 30,000 agent-written changes a day, teaches about offline-first assumptions, content-addressable caching, and merge-queue trade-offs."
date: 2026-10-18
category: "Engineering"
tags:
  [
    "git",
    "version-control",
    "ai-agents",
    "distributed-systems",
    "caching",
    "scion",
    "infrastructure",
  ]
draft: false
readingTime: 7
coverImage: "/blog/Git-to-Scion-Agents-at-Scale.png"
---

Anthropic just published [a piece about rebuilding their version control system from scratch](https://www.anthropic.com/engineering/redesigning-source-control), and the number that made me stop scrolling was this: in May 2026 they were merging about 2,500 code changes a day. By September, that number was over 30,000. Same company, four months apart, more than 10x the throughput.

That's not a team working harder. That's what happens when a growing share of your code changes come from Claude agents instead of humans typing on keyboards.

I went down the rabbit hole of understanding exactly what they built — a system called Scion — and the more I dug in, the more it turned into a genuinely interesting lesson in distributed systems, not just "big company builds big infra." Here's what I learned, explained the way I'd want someone to explain it to me.

---

## The assumption that quietly stopped being true

Git's entire design rests on one assumption: every client needs to be able to work completely offline. That's why `git clone` pulls down the entire history, not just what you're touching right now. That's why your laptop can compute diffs, walk blame, and check out any old commit without ever talking to a server. Every clone is a fully self-sufficient copy of the repo.

For almost every team on earth, that's a feature. You're on a flight, your home wifi dies, you're in a basement server room with no signal — doesn't matter, git still works.

But Anthropic's actual clients aren't people on laptops anymore. They're CI jobs, agent sandboxes, and research jobs — things that are, by definition, always online. Nobody's `git clone`-ing a monorepo on a plane. And CI alone was doing 25 million checkouts a day, against a repo whose main-branch history is almost 100GB on its own. Fetched the naive git way, that's over 600 petabytes a day of traffic. For a single internal monorepo.

So they asked a question that's worth sitting with: if nobody actually needs offline capability, why are we paying its cost 25 million times a day?

---

## The redesign, in one sentence

Scion flips git's model. Instead of "every client gets a full copy, then works offline," it's "the server holds everything, and clients ask for exactly what they need, over the network, every time."

If you've ever moved an app from "every service keeps its own local copy of some dataset" to "everything reads through a shared cache in front of the real database," you already understand this shift intuitively. Git is every node running its own full replica. Scion is a thin client talking to a tiered cache in front of an authoritative store — conceptually closer to how you'd put Redis in front of Postgres than to anything git-shaped.

The client (`scn`) barely computes anything on its own anymore. It doesn't know how to do a merge, compute a diff, or figure out blame — it asks the server, which does all of that and sends back the answer. In exchange, the client needs almost no local state at all.

---

## The trick that makes caching this aggressive actually work

Here's the part I found most elegant, and it's worth understanding even outside of version control.

Normally, caching is hard because of invalidation — the classic "there are only two hard things in computer science" joke. You cache a user's balance under the key `user:123:balance`, the balance changes, and now you need a TTL or an explicit cache-bust to stop someone reading stale data. The key stays the same while the value underneath it drifts.

Scion sidesteps this with content-addressable storage. Instead of storing a file under its path, it hashes the file's actual bytes and uses that hash as the storage key. Change one character in the file, you get a completely different hash — hash functions are designed that way on purpose (look up "avalanche effect" if you haven't seen the term before). The old version's hash still points to the old content, forever, because a hash can't mean two different things.

So when a cache serves an object, it's not "serve whatever's currently at this path" — it's "serve the exact bytes with this exact hash." Once that's answered correctly, it can never become wrong. No TTL needed. No invalidation logic. Cache forever, by construction.

This isn't a new idea, by the way — it's the same trick behind git's own object store, Docker image layers, and IPFS. Scion just applies it at the server-caching layer instead of the local-disk layer, and because of it, every tier in their fetch pipeline hits a 99%+ cache rate with almost no coordination between caches.

The one thing that doesn't get this treatment, on purpose, is the pointer to "main" — what commit the main branch currently points to. That's the one piece of deliberately mutable state in the whole system, and they keep it as small as possible: literally one row in a database, updated with a single compare-and-swap. Everything else can be cached blindly forever; this one thing has to be touched carefully, one write at a time.

---

## What actually happens when 30,000 changes land a day

This is where things get genuinely different from how you and I think about PRs.

In Scion, there's barely a concept of a feature branch. A "changeset" — their version of a commit — gets created directly on the server the moment it's authored, with no local commit-then-push step, because there's nothing to push to. It just... exists, instantly, everywhere.

Two agents can create changesets off the same parent commit at the exact same time with zero coordination, because neither one touches any shared state — each is just its own row describing "these files changed, here's what they point to now." The only moment coordination is required is when a changeset actually wants to become the new tip of main — and that's the single compare-and-swap we just talked about.

What they gave up is the traditional merge queue — the pattern where approved changes merge one at a time, each getting CI run against it before the next one is even allowed to start. At 30,000 merges a day, serializing through a queue like that would collapse immediately. So they invested in automated testing after the merge and before deploy, instead of strictly gating the merge itself. That means main can be transiently broken, or two unrelated changes can conflict without either one realizing it until after the fact. Their bet is that fast post-merge testing, plus agents that can spot and fix a conflict faster than a human would even notice it exists, makes this an acceptable trade at their scale.

That's a genuinely uncomfortable trade-off if you're used to "main always passes CI." It only makes sense once you accept that gating every single merge was never going to survive a 10x-ing of throughput anyway.

---

## The part that's actually useful if you're not Anthropic

None of this means you should go build your own git replacement — they say this explicitly, and it's correct. This only makes sense at genuinely enormous scale: tens of thousands of engineers, or swarms of agents producing code around the clock. For basically every team reading this, plain git is still the right tool.

What's worth stealing isn't the system, it's the pattern: push expensive, repeatable, metadata-style questions ("who last touched this line," "what changed between these two commits") behind a server-side API with aggressive, invalidation-free caching, instead of forcing every client to materialize full local state to answer them itself. That's a move you can make in a normal-sized system too — it's the same instinct behind exposing a read-model API backed by a cache instead of giving every service raw DB access.

The bigger signal, honestly, is less about the technology and more about what kind of bottleneck shows up first once code-writing itself stops being the constraint. Anthropic's bottleneck wasn't "can Claude write good code" — it was "can human-paced developer infrastructure keep up with code being written at machine speed." Source control, builds, CI — all the boring plumbing nobody thinks about until it's the thing actually slowing everyone down. Worth remembering the next time code generation feels like the hard part.

— _Nikhil Gautam_
