---
title: "Small Observation That Changed How I See Everyday Tech"
description: "TOTP (Time-based One-Time Password) enables two-factor authentication without internet connectivity by combining a shared secret key and 30-second time windows."
date: 2026-01-18
category: "Security"
tags: ["2fa", "totp", "security", "authentication", "backend"]
draft: false
readingTime: 3
---

Have you ever wondered how 2FA authenticator apps like Google Authenticator or Authy generate valid 6-digit verification codes even when your phone is completely offline or in Airplane Mode?

No internet connection. No SMS. No API request to the server. Yet the code generated on your phone matches the code expected by the server perfectly.

### The Magic Behind TOTP (RFC 6238)

It turns out TOTP (Time-based One-Time Password) is surprisingly simple and elegant. It relies on two shared inputs:
1. **A Shared Secret Key**: Generated during 2FA setup (the QR code you scan contains this secret).
2. **Current Time**: Divided into 30-second intervals (known as time steps).

Because both your phone and the authentication server know the current Unix time and share the secret key, both sides can compute the exact same hash independently without communicating over the network!

### Simplified Implementation

Here is a simplified conceptual JavaScript snippet demonstrating how TOTP works under the hood:

```javascript
import crypto from 'crypto';

function generateTOTP(secretKey, timeStepSeconds = 30) {
  // 1. Calculate current time window index
  const epochTime = Math.floor(Date.now() / 1000);
  const timeCounter = Math.floor(epochTime / timeStepSeconds);

  // 2. Convert counter into an 8-byte buffer
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeCounter));

  // 3. Compute HMAC-SHA1 signature using secret key and time buffer
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  // 4. Dynamic Truncation to extract 4-byte integer
  const offset = hmacResult[hmacResult.length - 1] & 0x0f;
  const codeInt =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  // 5. Generate 6-digit code using modulo 1,000,000
  const otp = (codeInt % 1000000).toString().padStart(6, '0');
  return otp;
}
```

### Why Clock Drift Matters
Because TOTP depends on system time, if your phone clock drifts out of sync by even a minute, the time step counter changes and your codes fail. Authentication servers usually accept codes from the adjacent 30-second window (t-1, t, t+1) to account for slight clock drift.

Understanding everyday tech at the protocol level reminds us how simple mathematics and clean design solve critical security challenges without complex infrastructure.
