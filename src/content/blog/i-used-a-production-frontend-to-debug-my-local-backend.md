---
title: "I Used a Production Frontend to Debug My Local Backend"
description: "A practical guide on how to use tools like Requestly and ngrok to redirect browser requests from a production frontend to your local backend, making debugging multi-step workflows significantly easier."
date: 2026-08-28
category: "Career"
tags:
  ["debugging", "network-requests", "requestly", "api", "development", "ngrok"]
draft: false
readingTime: 8
coverImage: "/blog/requestly-backend-debug-thumbnail.png"
---

Okay, so debugging is hard.

And it becomes way harder when you don't have access to certain parts of the code and the issue is happening somewhere in the middle of an application's workflow.

Recently, I was debugging an issue in our backend where reproducing the bug required going through a specific sequence of APIs.

It was not something like:

```text
POST /create
  │
  ▼
bug
```

It was more like:

```text
Create something
  │
  ▼
Update something
  │
  ▼
Approve something
  │
  ▼
Generate something
  │
  ▼
Receive something
  │
  ▼
Finally hit the API where the bug happens
```

The problem was that every time I made a change in the backend code, I had to repeat that entire workflow again before I could even test whether my change fixed the issue.

And this is where debugging starts becoming painful.

---

## The API Client Approach

My first option was pretty obvious:

**Use an API client.**

I use Bruno, so I could manually execute all the APIs required to reproduce the workflow.

For example:

```http
POST /api/order
POST /api/order/:id/approve
POST /api/order/:id/items
POST /api/order/:id/receive
GET  /api/order/:id
```

Then finally:

```http
GET  /api/report
```

where the actual bug was happening.

Technically, this works.

But there is a problem.

Every time I restart my backend or change something that affects the workflow, I have to run those APIs again.

And it is not just about clicking "Send".

You have to prepare the request body, check headers, authentication, IDs, query parameters, dependencies between requests, and sometimes copy values from one response into the next request.

Yes, you can automate a lot of this.

But now we are building another system just to reproduce the workflow.

And I really didn't want to do that for a bug I was trying to debug.

---

## So What Are the Other Options?

There are a few obvious solutions.

### 1. Write a testing script

We could write a script that executes the complete workflow.

Something like:

```text
Create  ──►  Approve  ──►  Update  ──►  Receive  ──►  Verify
```

This is actually a good solution if the workflow is something we need to test repeatedly.

But for a one-off debugging session, it can be overkill.

Now I need to maintain the script, prepare test data, handle authentication, deal with dependencies between APIs, and make sure the script still works whenever the API changes.

### 2. Mock the workflow

Another option is mocking.

Instead of actually going through the complete workflow, we could mock the required state or API responses.

This is useful when you specifically want to test an isolated component.

But in my case, the whole point was to reproduce a real backend workflow.

If I mock too much, I might end up debugging a scenario that doesn't actually represent what the application is doing.

### 3. Write proper test cases

And obviously, there is the proper engineering solution:

**Write automated tests.**

Unit tests, integration tests, end-to-end tests, whatever makes sense for the application.

And yes, we should have them.

But automated tests and debugging a specific issue are not always the same thing.

Sometimes you are in the middle of investigating an existing system and you just want to answer a simple question:

> "Does my local backend change actually fix the issue when the real frontend performs the workflow?"

That is exactly where I was stuck.

---

## Then I Thought About the Frontend

At this point I thought:

**Why am I doing all of this manually?**

We already have a frontend deployed.

The frontend already knows how to perform the workflow.

It already knows:

- which APIs to call
- in which order to call them
- what request body to send
- what headers are required
- how authentication works
- how to handle the responses
- how to move from one step to another

So instead of reproducing the workflow manually using an API client...

**Why not just use the application itself?**

There was just one problem.

I didn't have access to the frontend repository.

And even if I did, setting up the entire frontend locally would take time.

Install dependencies.

Configure environment variables.

Configure the correct API URLs.

Set up authentication.

Run the application.

Make sure everything works.

And honestly...

I didn't want to do all of that just to debug a backend issue.

I'm pretty sure you don't want to either.

---

## What I Actually Wanted

I didn't need the frontend code.

I didn't need to modify the frontend.

I didn't even need to run the frontend locally.

I already had a deployed frontend that was working.

All I wanted was:

```text
Deployed Frontend
       │
       ▼
  API Request
       │
       ▼
My Local Backend
       │
       ▼
  Local Logs
       │
       ▼
    Debugger
```

In other words:

> **Use the deployed frontend, but send its API requests to my local backend.**

And this is where Requestly comes into the picture.

---

## Enter Requestly

[Requestly](https://requestly.com/) is basically an HTTP interception and modification tool that lets you change network requests without changing the application code.

One of the things it supports is redirecting requests from one URL to another. It can match requests using things like URL, host, path, wildcard, or regex patterns.

So imagine my deployed frontend normally calls:

```text
https://api.example.com/api/orders
```

But my backend is running locally on:

```text
http://localhost:8000
```

I can create a rule that effectively says:

```text
When the frontend requests:

https://api.example.com/api/orders

send that request to:

http://localhost:8000/api/orders
```

Now the browser still thinks it is using the deployed application.

But the request is actually reaching my local backend.

And that completely changes the debugging workflow.

---

## Before Requestly vs. After Requestly

### Before Requestly

My workflow looked something like this:

```text
Make backend change
        │
        ▼
   Open Bruno
        │
        ▼
 Prepare request
        │
        ▼
   Run API 1  ──►  Run API 2  ──►  Run API 3  ──►  Run API 4  ──►  Run API 5
                                                                     │
                                                                     ▼
                                                           Finally reproduce bug
                                                                     │
                                                                     ▼
                                                                Check logs
                                                                     │
                                                                     ▼
                                                                  Repeat
```

Very painful.

### After Requestly

Now it looks like this:

```text
Make backend change
        │
        ▼
Refresh application
        │
        ▼
Use application normally
        │
        ▼
Frontend calls APIs
        │
        ▼
Requestly redirects them
        │
        ▼
Local backend receives requests
        │
        ▼
Check logs / debugger
        │
        ▼
Repeat
```

This is much closer to how the actual application behaves.

And that was exactly what I wanted.

---

## How to Set It Up

Let's say we have a very simple setup.

Our deployed frontend:

```text
https://app.example.com
```

Production API:

```text
https://api.example.com
```

Local backend:

```text
http://localhost:8000
```

And suppose the frontend calls:

```text
https://api.example.com/api/orders
```

We want that request to reach:

```text
http://localhost:8000/api/orders
```

### Step 1: Install Requestly

Install the Requestly browser extension or use its desktop application.

Requestly currently provides browser interception as well as a desktop application for broader traffic interception.

For this particular use case, the browser extension is enough if the requests are coming from the browser.

### Step 2: Start Your Local Backend

First, make sure your backend is running locally.

For example:

```bash
npm run dev
```

And verify that it is available at:

```text
http://localhost:8000
```

You can also quickly test it directly:

```text
http://localhost:8000/api/health
```

The important thing is that the local backend should be able to receive the same request that the deployed frontend normally sends.

### Step 3: Expose Your Local Backend to the Internet

There is one important thing I initially overlooked:

> **You cannot simply redirect a request from a deployed frontend to `localhost`.**

The browser is running the deployed frontend, while your backend is running on your own machine. The deployed frontend's browser context needs a publicly reachable URL that can forward traffic to your local machine.

This is where a tunneling tool such as **ngrok** comes in.

If your local backend is running on:

```text
http://localhost:8000
```

start ngrok with:

```bash
ngrok http 8000
```

ngrok will give you a public HTTPS URL similar to:

```text
https://abc123.ngrok-free.dev
```

Now the request path becomes:

```text
Deployed Frontend
       │
       ▼
   Requestly
       │
       ▼
     ngrok
       │
       ▼
localhost:8000
       │
       ▼
 Local Backend
```

Before continuing, verify that the ngrok URL actually reaches your local backend.

For example:

```text
https://abc123.ngrok-free.dev/api/health
```

If that returns your local API response, the tunnel is working.

#### One issue with the ngrok free version

There is another small trap here.

If you are using the free version of ngrok, browser requests can encounter the ngrok browser warning/interstitial page before ngrok forwards the request to your local backend.

This is particularly problematic in this setup because the frontend is making an API request.

Instead of receiving your API response, the frontend can receive the ngrok visit page and effectively get stuck.

For example, instead of:

```text
GET /api/auth/me  ──►  localhost:8000  ──►  JSON response
```

you can end up with:

```text
GET /api/auth/me  ──►  ngrok  ──►  browser visit page  ──►  frontend gets HTML instead of API response
```

The fix is to tell ngrok to skip the browser warning.

Create another Requestly rule:

```text
Modify Headers
```

and add this request header:

```text
Header:
ngrok-skip-browser-warning

Value:
1
```

The important part is that this header must be added to the request that ultimately reaches ngrok.

So the effective flow becomes:

```text
Deployed Frontend
       │
       ▼
   Requestly
       │
       ├── Redirect request
       │
       └── Add header: ngrok-skip-browser-warning: 1
       │
       ▼
     ngrok
       │
       ▼
localhost:8000
       │
       ▼
 Local Backend
```

This prevents the ngrok browser warning page from being returned instead of your API response.

This was one of the confusing parts of the setup because the tunnel itself was working. I could access the ngrok URL directly and see my API response, and requests made from the terminal worked as well.

But the browser request from the deployed frontend was different.

The browser was getting an ngrok response such as:

```text
ERR_NGROK_6024
```

instead of the response from my Express application.

Once I added:

```http
ngrok-skip-browser-warning: 1
```

the browser request was forwarded to my local backend correctly.

### Step 4: Open HTTP Rules

Open Requestly and go to:

```text
HTTP Rules
```

Create a new rule and select:

```text
Redirect Request
```

Requestly's Redirect Rule is specifically designed for redirecting matching HTTP requests to another destination, including localhost or another environment.

### Step 5: Configure the Source

Now we need to tell Requestly which request we want to intercept.

For example:

```text
https://api.example.com/api/orders
```

You can match requests using conditions such as:

```text
Equals
Contains
Wildcard
Regex
```

For example, if I want to redirect every API request from this backend:

```text
https://api.example.com/api/*
```

I could use a wildcard-style rule.

But I usually recommend starting with the **smallest possible scope**.

Instead of:

```text
https://api.example.com/*
```

start with:

```text
https://api.example.com/api/orders
```

This prevents you from accidentally redirecting APIs that your local backend isn't ready to handle.

Requestly also supports additional filters to narrow down which requests a rule affects.

### Step 6: Preserve the Remaining Route

This is another small detail that matters when using wildcard redirects.

Suppose the production API URL is:

```text
https://api.example.com/hospital/api/orders/123
```

and you configure:

```text
https://api.example.com/hospital/*
```

Make sure the matcher is **Wildcard**, not simply **Contains**.

The wildcard portion can then be referenced in the destination using `$1`.

For example:

```text
Source:
https://api.example.com/hospital/*

Destination:
https://abc123.ngrok-free.dev/$1
```

So:

```text
https://api.example.com/hospital/api/orders/123
```

becomes:

```text
https://abc123.ngrok-free.dev/api/orders/123
```

This is important because using `*` with a `Contains` condition does not capture the remaining route. In that case, `$1` will not contain the path you expect.

### Step 7: Redirect to the ngrok URL

Now configure the destination as your ngrok URL.

For example:

```text
https://abc123.ngrok-free.dev/$1
```

So the complete rule becomes:

```text
SOURCE
https://api.example.com/hospital/*
        │
        ▼
DESTINATION
https://abc123.ngrok-free.dev/$1
```

The ngrok URL then forwards the request to:

```text
http://localhost:8000
```

![Configuring Requestly Redirect Rule with ngrok destination URL](/blog/requestly-redirect-rule.png)

### Step 8: Configure the ngrok Header Rule

Now create the second Requestly rule:

```text
Modify Headers
```

Add:

```text
ngrok-skip-browser-warning: 1
```

The important thing to understand is that the redirect changes the URL, while the header rule needs to apply to the request that reaches ngrok.

If the redirect rule changes:

```text
https://api.example.com/...
```

into:

```text
https://abc123.ngrok-free.dev/...
```

then the header modification needs to target the resulting ngrok request, or otherwise be applied as part of the same request modification flow before the request reaches ngrok.

The final objective is simple:

```text
Request
   │
   ├── URL is changed to ngrok
   │
   └── Header added: ngrok-skip-browser-warning: 1
   │
   ▼
 ngrok
   │
   ▼
localhost
```

![Adding ngrok skip browser warning header in Requestly](/blog/requestly-ngrok-header-rule.png)

### Step 9: Open the Deployed Frontend

Now open:

```text
https://app.example.com
```

Use the application normally.

For example:

```text
Login  ──►  Open Orders  ──►  Create Order  ──►  Approve Order  ──►  Receive Order
```

The frontend doesn't need to know anything about your local backend.

From its perspective, it is still making the same API request.

Requestly intercepts that request and sends it through ngrok to your local server instead.

### Step 10: Check Your Local Logs

This is the best part.

Instead of watching requests inside Bruno, you can now watch your actual backend.

For example:

```text
POST /api/orders
POST /api/orders/123/approve
POST /api/orders/123/receive
```

You can put breakpoints directly inside your backend code:

```ts
export const receiveOrder = async (req: Request, res: Response) => {
  // Put breakpoint here

  const order = await getOrder(req.params.id);

  // ...
};
```

Then simply perform the action from the frontend.

The request hits your local backend and your debugger stops exactly where you want it to.

Now debugging becomes:

```text
Click button in UI
        │
        ▼
Request reaches local backend
        │
        ▼
Debugger stops
        │
        ▼
Inspect variables
        │
        ▼
Make change
        │
        ▼
Refresh
        │
        ▼
Try again
```

No manually rebuilding the workflow in Bruno.

---

## There Is One Important Catch

There is one thing you need to understand.

Redirecting a request does not magically make your local backend identical to production.

Your local environment still needs to support the request.

For example, if the frontend sends:

```http
Authorization: Bearer <token>
```

your local backend needs to be able to validate that token.

If the frontend sends cookies, your local setup needs to handle them correctly.

If the production API depends on specific headers, your local backend may need those headers as well.

And if the backend is making calls to other services, those dependencies still exist.

So Requestly is not replacing your backend environment.

It is simply changing **where the browser sends the request**.

That distinction is important.

---

## CORS Can Also Appear

Once you redirect a browser request from your deployed frontend to an ngrok URL, you have introduced another origin.

For example:

```text
https://dev-axon.medoc.app
```

is now making a request to:

```text
https://abc123.ngrok-free.dev
```

That means your local backend may need to handle CORS.

For a local debugging environment, a configuration such as this can be useful:

```ts
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "latitude", "longitude"],
};

app.use(cors(corsOptions));
```

One useful debugging lesson here is to distinguish between a **CORS problem** and a **tunnel problem**.

If the browser sends:

```http
OPTIONS /api/auth/me
```

and your backend receives it:

```http
OPTIONS /api/auth/me 204
```

but the actual:

```http
GET /api/auth/me
```

never appears in your backend logs, then the `GET` is probably being stopped somewhere before Express.

In my case, inspecting the actual response revealed:

```text
Status Code: 200
Content-Type: text/html
Ngrok-Error-Code: ERR_NGROK_6024
```

That immediately told me that the response was coming from ngrok rather than my backend.

The important lesson was:

> **Don't assume every browser error mentioning CORS is actually an application CORS problem. Follow the request through the network path.**

---

## You Don't Always Need to Redirect the Whole API

This is another thing I found useful.

Suppose the application has 50 APIs.

You don't necessarily want all 50 requests going to your laptop.

Maybe only one endpoint is related to the bug:

```http
POST /api/orders/:id/receive
```

Then redirect only that endpoint.

Your workflow becomes:

```text
Frontend
   │
   ├── GET  /api/users        ──► Production
   ├── GET  /api/orders       ──► Production
   ├── POST /api/orders       ──► Production
   │
   └── POST /api/orders/123/receive
                 │
                 ▼
           Local Backend
```

This is much safer and usually much easier to debug.

You can gradually expand the scope if you need more APIs locally.

---

## Redirect vs. Replace

Requestly also has a **Replace String** rule, which can be useful when you want to replace part of a URL rather than explicitly define the entire destination.

For example, replacing a production hostname:

```text
https://api.example.com
```

with:

```text
http://localhost:8000
```

can turn:

```text
https://api.example.com/api/orders/123
```

into:

```text
http://localhost:8000/api/orders/123
```

This can be convenient when you want many endpoints to follow the same mapping.

The important thing is to understand the difference:

> **Redirect**
> This exact request ──► Go to this exact destination

> **Replace**
> Find this part of the URL ──► Replace it ──► Keep the rest of the URL

Both can be useful depending on how broad your rule needs to be.

---

## And This Is Not Just Useful for Debugging

Once you realize you can intercept requests like this, there are many other things you can do.

For example, you can use the same idea to:

- test a staging API with a production frontend
- test a new API version without changing frontend code
- redirect third-party APIs to a mock server
- modify request headers
- modify query parameters
- modify request bodies
- modify API responses
- simulate delays
- block specific requests

Requestly supports these kinds of HTTP modifications in addition to redirects.

For example, imagine your production frontend calls:

```text
https://api.example.com/api/payment
```

but you want to test the new version:

```text
https://api.example.com/api/v2/payment
```

You can redirect the old endpoint to the new one and see how the existing frontend behaves.

Or suppose you want to test what happens when an API takes five seconds to respond.

You can introduce a delay without changing the backend.

Or suppose you want to test how the frontend handles a `500` response.

You can modify the response instead of intentionally breaking your backend.

That's where these tools become much more than just a debugging trick.

---

## One More Thing: Be Careful With Production

There is an obvious warning here.

You are using a **deployed frontend** and potentially real production data.

So don't blindly redirect every production API to your local machine.

Especially avoid doing something like:

```text
https://api.example.com/*
        │
        ▼
http://localhost:8000/*
```

unless you completely understand the consequences.

You might redirect authentication requests, payment requests, file uploads, third-party integrations, or other APIs that your local environment cannot safely handle.

Start small.

Redirect only the endpoint you need.

Use test accounts and test data where possible.

And always disable the Requestly rule when you're done.

Otherwise you might forget that your browser is still sending production application traffic to localhost and spend the next thirty minutes wondering why something suddenly stopped working.

Trust me, this is exactly the kind of debugging bug you don't want to create while fixing another debugging bug.

---

## The Actual Lesson

The interesting part of this whole thing isn't Requestly.

The interesting part is realizing that sometimes we create unnecessary work because we approach a debugging problem from the wrong direction.

I initially thought:

> "I need to reproduce this workflow."

So I started thinking about API clients, scripts, mocks and tests.

But the application was already capable of reproducing the workflow.

The frontend already knew how to do it.

I just needed to change one thing:

**Where the request goes.**

Once I realized that, the whole debugging process became much simpler.

Instead of:

```text
Production Frontend  ──►  Production Backend
```

I could temporarily turn it into:

```text
Production Frontend
        │
        ▼
    Requestly
        │
        ▼
      ngrok
        │
        ▼
  Local Backend
        │
        ▼
    Debugger
```

And suddenly I didn't need to manually reproduce the workflow anymore.

I could just use the application.

Click the button.

Let the frontend do its thing.

And debug the backend exactly as the request comes in.

Sometimes the easiest way to debug a system isn't to reproduce the system manually.

> **It's to let the system reproduce itself — and just change where the request goes.**

— _Nikhil Gautam_
