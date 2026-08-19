---
title: "Small Observation That Changed How I See Everyday Tech"
description: "TOTP (Time-based One-Time Password) enables two-factor authentication without internet connectivity by combining a shared secret key and 30-second time windows."
date: 2026-01-18
category: "Security"
tags: ["2fa", "totp", "security", "authentication", "backend"]
draft: false
readingTime: 3
---

It is amazing how perspective changes when you really think about and understand how certain technology works.

About a month ago, I got a home WiFi connection. Before that, I was solely dependent on a mobile hotspot for all my network needs, and I was quite comfortable with it. During that time, my mobile data remained turned on for the entire day because I needed to connect it to my PC, so I always kept it active. After I got the WiFi connection, I stopped using mobile data and, in fact, stopped using my mobile altogether except for calls and texting.

One day, I was logging into our organization’s production database, and it required 2FA. For this, I needed to use the Microsoft Authenticator app. I went with the flow, opened the login screen, entered my credentials, used the app for 2FA, and completed the login.

Suddenly, I realized that during the whole process I had not turned on mobile data on my device, and WiFi was also turned off. This sparked curiosity in me about how this worked without internet access. My initial guess was that I might have forgotten turning on and off the data during that process. So I tried again, and the result was the same. I was able to complete 2FA without internet on my mobile device.

I immediately started looking for answers. After some research and going through blogs and articles, I got a basic idea of how it was working.

---

## How TOTP Works

I found out that it was using the **TOTP** (Time-based One-Time Password) standard, which is a time-based OTP generation mechanism. The idea is very simple. Whenever we enable 2FA for any service, it generates a secret key. That key is stored on the server and is also given to the user, usually via a QR code or a key string.

Both the server and the client have the exact same key and use the same hashing logic to generate the OTP. However, there is one issue. The same key would always generate the same OTP, so we need a mechanism to change it periodically. For this, time is used as a second parameter.

What happens is that the generator function takes the current time and divides it into **30-second time windows**. From this, it calculates the current time window step, which is valid for 30 seconds. This step is then used along with the secret key to generate the OTP.

---

## Replicating the Logic: A Simple Example

Once I understood the concept, I tried to replicate it, and I will use that to explain it more clearly. The following is just an example and should be used only for intuition building, not for production.

First, we need a secret key. For simplicity, we will use a random number:

```javascript
const secretKey = 123456;
```

Next, we need the current time window step for time bounding. For this, we use the current UNIX time and divide it by 30. A shorter interval means shorter expiry and higher security:

```javascript
function getTimeWindow(interval) {
  return Math.floor(Date.now() / 1000 / interval);
}
```

Then we need a generator function that takes the secret key and returns an OTP. This function first calls the `getTimeWindow` function with the required interval, multiplies the returned value with the secret, and then applies a modulus with the number of digits required. Since multiplication can result in a very large number, we reduce it using modulus and apply padding to make it look like an OTP:

```javascript
function generateOTP(secret) {
  const timeWindow = getTimeWindow(30);
  const raw = Number(secret) * timeWindow;
  const otp = raw % 1_000_000;
  return otp;
}
```

This is our simple authenticator app implementation. You can verify it by running the code. It will output an OTP. Then wait for 30 seconds, or reduce the interval for faster testing, and run it again. It will output a different OTP.

---

## The Core Concept

I have abstracted many things in this implementation, but that does not stop us from understanding the flow. The core idea behind TOTP remains the same:

1. `Generate a random secret key.`
2. `Store it on the server and give it to the user.`
3. `At the time of verification, both parties independently generate the OTP using the same key and the current time window step, and then use it for authentication.`

In production systems, complex cryptographic hash functions are used to generate TOTPs, along with many additional security measures (There is a lot more going on here, and I will explore it in more detail later).

---

## Conclusion

What I learned is that some everyday technologies we use without a second thought are actually worth paying attention to. Every time I dig into something that looks simple on the surface, I find that underneath it has an amazingly well-thought-out implementation that always amazes me.

— _Nikhil_
