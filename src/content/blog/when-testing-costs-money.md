---
title: "When Testing Costs Money"
description: "A real-world experience integrating a third-party API that lacked a sandbox environment and charged per call, requiring mock implementations and offline testing."
date: 2026-02-18
category: "Engineering"
tags: ["testing", "api", "architecture", "mocking", "backend"]
draft: false
readingTime: 4
---

As developers, we always come across scenarios where we have to integrate **Third Party APIs (TPA)** into our current application. It can be anything from payment portal integration to just fetching weather information from public APIs.

It really gives our system new capabilities without much effort. But at the same time, it also introduces new difficulties such as handling completely different request and response formats from our current system, the **Black Box problem** (we actually don’t know how things are internally working), error handling, retry loops, etc.

All the mentioned problems are already given attention in many blogs and youtube videos, but one problem that I specifically see as most important is the testing and production environments of TPAs. Some highly scaled TPAs provide different environments for testing and production, but some APIs which are not well scaled or are in the initial phase lack this.

---

## The Challenge: No Sandbox Environment

A similar situation happened to me as well. It happened when a friend of mine introduced me to a startup founder. They were working on some project and needed someone to integrate a third-party API, so my friend recommended me for that. I joined their Discord invite, they told me about their requirements, and also mentioned that the TPA they wanted to integrate doesn’t provide a testing environment. They just provide credits, we can only use them, and it’s up to us how we utilize them.

So they wanted someone who could integrate their APIs with minimal testing so they don’t lose many credits. That’s why they were outsourcing it.

But as we all know, development is a game of hit and trial. You try something; if that works, you use it or improve your next attempt based on the outcome. But here it was also the case of optimizing my development strategy so that it costs less for the company.

I thought about it and told them I wanted to try (don’t know the reason why I said yes, I could have rejected their offer, but I took it as a challenge).

---

## Designing the Strategy

I started by reading the TPA’s docs, and surprisingly, they were very well written. My initial thought was that first I would read the docs, then implement them and test it. But soon I realized I am a human (obviously) and prone to errors, and I would definitely make silly mistakes like not sending the bearer token or missing important query parameters, and it would cost me credits.

So I changed my strategy. First, I tried the APIs on **Bruno** and documented the request and response. (I don’t use Postman for testing APIs; I prefer Bruno for offline file storage and GitHub integration)

Then I did a **mock implementation** of the TPA with the required flows under different conditions to also counter errors, and used that for the initial implementation. I completed my implementation with mocks and tried to handle all cases. Then I tried it with the actual TPA, and it failed because I forgot to change the implementation. After changing it to the actual implementation, somehow it worked, and it was working completely fine with all the cases (that I could think of).

---

## Results & Takeaways

My testing was done, and I used **less than 20 requests** for this (I would love to hear your approaches for integrating TPAs). I handed over the implementation to them and they were quite impressed about it.

And yes, it was a lot of work, but I did it. I won’t say I enjoyed this, but it was something that taught me why being a developer doesn’t mean you just write things rather, you account for them.

— _Nikhil Gautam_
