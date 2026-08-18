---
title: "It Worked in Dev. It Worked in QA. Then Production Happened."
description: "A backend production incident where an appointment endpoint caused 4-second response times due to an N+1 query problem with 6,000+ DB calls, and how we solved it with query batching and projections."
date: 2026-01-11
category: "Architecture"
tags: ["database", "n+1-query", "performance", "backend", "mongodb"]
draft: false
readingTime: 5
---

In local development and QA environments, everything worked lightning fast. The endpoint returned in 40ms with test data containing 10 appointments and 5 patients.

Then we deployed to production. 

Response times spiked to **4,200ms (4.2 seconds)** for doctor dashboard queries.

### The Incident: The Silent N+1 Query Trap

When doctors fetched their daily appointments, the backend executed a loop that fetched patient details individually for each appointment:

```javascript
// BAD: Classical N+1 Database Query Pattern
const appointments = await AppointmentModel.find({ doctorId });

const result = await Promise.all(
  appointments.map(async (app) => {
    // ⚠️ Makes a separate database round-trip for every single appointment!
    const patient = await PatientModel.findById(app.patientId);
    return { ...app.toObject(), patient };
  })
);
```

In production, active doctors had hundreds of appointments with thousands of historical records over time. For 100 appointments, this executed **101 separate database queries**. Multiply that by thousands of concurrent requests, and the database connection pool was starved, CPU utilization spiked, and API latencies plummeted.

### The Fix: In-Memory Map Batching & Field Projections

Instead of fetching patient details inside a loop, we refactored the logic to fetch all required patient records in a **single batched query** using `$in` and indexed lookups:

```javascript
// GOOD: Batched Query + In-Memory Hash Map
const appointments = await AppointmentModel.find({ doctorId }).lean();

// 1. Collect unique patient IDs
const patientIds = [...new Set(appointments.map((a) => a.patientId))];

// 2. Fetch all matching patients in ONE database query with field projection
const patients = await PatientModel.find(
  { _id: { $in: patientIds } },
  { name: 1, phone: 1, email: 1 } // Only fetch required fields
).lean();

// 3. Construct O(1) lookup Map
const patientMap = new Map(patients.map((p) => [p._id.toString(), p]));

// 4. Stitch data in memory
const result = appointments.map((app) => ({
  ...app,
  patient: patientMap.get(app.patientId.toString()) || null,
}));
```

### Results
- Database queries reduced from **6,000+ queries** per batch down to **2 queries**.
- API response time dropped from **4,200ms to 550ms** (an 87% performance boost).
- Database CPU load dropped by over 60%.

### Key Takeaways
1. **Never test with toy datasets alone**: Always seed dev/QA with realistic production volume data.
2. **Beware of loop-based DB calls**: Look for `map(async ...)` or nested queries — batch lookups using `$in` / SQL `IN (...)` whenever possible.
3. **Use projections**: Don't load full heavy documents when you only need `name` and `email`.
