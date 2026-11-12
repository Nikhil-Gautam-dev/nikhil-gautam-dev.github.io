---
title: "I Didn't Want to Replace This Library, So I Fixed It"
description: "What happens when one of your features depends on an open-source library that is no longer maintained? And what if that library suddenly needs a security update?"
date: 2026-11-12
category: "Open Source"
tags:
  [
    "open-source",
    "nodejs",
    "cloudinary",
    "multer",
    "maintenance",
    "security",
  ]
draft: false
readingTime: 4
coverImage: "/blog/fixing-the-forgotten-library.png"
---

What happens when one of your features depends on an open-source library that is no longer maintained? And what if that library suddenly needs a security update?

I faced a similar situation last year.

I was working on a third-party integration that required [multer-storage-cloudinary](https://github.com/affanshahid/multer-storage-cloudinary), a library that allows Multer to store uploaded files directly on Cloudinary.

The library had been around for quite some time, and everything was working fine. There were no issues with it, so I integrated it into the application. It continued working without any problems for the next four months.

Then, one day, I found out that Cloudinary had fixed a vulnerability in its SDK and released an updated version. My integration needed to move to that newer SDK.

Initially, I thought it wouldn't be a big deal. I would just update the utility library, assuming it had already addressed the issue.

But when I opened its GitHub repository, I found nothing. No new release, no updates, not even a single commit in the last year. Complete silence.

The library was still using cloudinary v1.21.0, while the newer SDK was already at v2.8.0.

Now, I had two options:

1. Ditch the existing package and migrate to another alternative.
2. Replace it with a self-written utility and publish it, which would also mean taking responsibility for maintaining it publicly.

But I didn't have enough time for either option. The application was already in production, and migration would require additional development time and potentially some downtime.

So, I chose a middle ground.

---

Instead of replacing the entire integration, I took the existing utility package and updated it to work with the newer Cloudinary SDK.

It wasn't just a matter of changing the dependency version. The SDK had introduced changes that required updates to the implementation, including handling changes in TypeScript types and adapting the existing utilities to the new SDK structure.

Along with that, I also added a few utility functions that I always felt were missing.

Once everything was working, I moved the updated package to our organization's repository so that other projects could use it as well.

It's been almost a year now, and we haven't faced any issues with our maintained version.

---

Last month, while going through my contributions, I came across this work again. It made me think about getting these changes back into the original package.

I could also publish my own version, but I know that doing so wouldn't necessarily get it in front of the people who actually need it. The original package already has its users, documentation, and existing integrations.

So, instead, I reached out to the original package's developer and shared my changes.

Now I'm waiting for their response, hopefully with a chance to get these fixes merged into the original project.

---

Sometimes, maintaining software isn't just about writing something new. It's also about keeping the things we already depend on alive.
