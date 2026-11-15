---
title: "Two Days of Debugging. One Look at the Documentation."
description: "How a face recognition feature worked in Dev but failed in Production due to a ChromaDB distance metric configuration mistake, and why reading the documentation solved it."
date: 2026-11-15
category: "Engineering"
tags: ["debugging", "chromadb", "ai", "vector-database", "backend", "python"]
draft: false
readingTime: 4
coverImage: /blog/two-days-debugging-chromadb-configuration.png
---

Okay, so we had a face recognition feature that was working perfectly fine in Dev but refused to recognise anyone in Production.

Naturally, the first thing we suspected was the AI model.

I wasn't the person who built the face recognition system. Most of that work was handled by our AI team. My responsibility was to integrate it with our backend, handle the API flows, and make sure everything worked together.

The feature used DeepFace to generate face embeddings and ChromaDB to store and search those embeddings.

Everything looked fine in Dev. We pushed it, tested it, and it worked.

Then it reached Production.

And suddenly, nobody was recognisable.

## We thought it was the model

The AI team initially suggested that it might be a model issue, specifically something related to embedding generation.

I thought the same.

After all, if the embeddings themselves were incorrect, comparing them against the stored embeddings wouldn't produce meaningful results either.

We spent almost two days trying to understand what was going wrong. We looked at different possibilities, but nothing immediately explained why the same feature was working in one environment and failing in another.

Eventually, I decided to stop guessing and go through the ChromaDB documentation properly.

## Two days later, the documentation gave me the answer

I started reading the ChromaDB documentation, particularly the sections about collection initialization and index configuration.

While going through it, I noticed something in our initialization code that I had completely overlooked.

Our original implementation looked like this:

```python
self.collection = self.client.get_or_create_collection(
    name="face_embeddings",
    metadata={"hnsw:space": "cosine"}
)
```

At first glance, it looked correct.

We wanted cosine distance, and we were passing `hnsw:space` with the value `cosine`.

But the documentation made me realise that we were passing this setting in the wrong place.

There is a difference between collection metadata and index configuration.

We were putting `hnsw:space` inside `metadata`, which is meant for storing collection metadata. It wasn't actually configuring the index distance metric.

ChromaDB provides a separate `configuration` parameter for this.

That was when things started making sense.

The Dev and Production environments had not actually been using the same distance metric.

The Dev collection had been created with the correct cosine distance configuration, which is why recognition was working there.

Production, however, had its collection created through our incorrect initialization implementation. Since the distance metric wasn't properly configured, ChromaDB used its default squared L2 distance instead.

We had been assuming both environments were comparing embeddings in the same way.

They weren't.

## Why did this break face recognition?

A little context makes this easier to understand.

DeepFace, using the ArcFace model in our case, generates a 512-dimensional embedding for a face.

Think of an embedding as a numerical representation of a face. We store these representations and compare a newly generated embedding against existing ones to identify a person.

But comparing two vectors requires a distance metric.

We expected ChromaDB to calculate cosine distance:

```python
d_cosine = 1 - (dot(A, B) / (norm(A) * norm(B)))
```

Instead, Production was using squared Euclidean (L2) distance:

```python
d_L2 = sum((A[i] - B[i]) ** 2 for i in range(512))
```

Both metrics measure the difference between vectors, but they do it differently and produce different numerical values.

Our recognition logic had a threshold of `0.5`.

With cosine distance, the values were within the range our matching logic expected.

But in Production, we were getting distances around `100`.

Since our application considered a match valid only when the distance was below `0.5`, every comparison was failing.

The application wasn't recognising anyone because the distance metric used by the database didn't match what our recognition logic expected.

The embeddings weren't necessarily the problem. We were measuring the distance between them differently.

## The fix was surprisingly small

Once I understood the difference, fixing the initialization code was straightforward.

I changed it to use the explicit configuration parameter documented by ChromaDB.

The updated implementation looked like this:

```python
self.collection = self.client.get_or_create_collection(
    name="face_embeddings",
    embedding_function=None,
    configuration={
        "hnsw": {
            "space": "cosine"
        }
    },
    metadata={"description": "face embeddings"}
)
```

Notice the difference?

Instead of putting `hnsw:space` inside metadata, we were now explicitly configuring the index.

I also specified `embedding_function=None` because we were already generating embeddings through DeepFace and passing those vectors to ChromaDB ourselves.

That was the actual implementation mistake.

After correcting the configuration and ensuring Production was using a collection with the correct distance metric, the distance values were back in the expected range, and face recognition started working.

## What I took away from this

Honestly, this was one of those bugs where the actual fix was much smaller than the time spent finding it.

We initially suspected the AI model, then embedding generation. It was a reasonable assumption because the failure was happening during face recognition.

But the actual problem had nothing to do with changing the model or generating better embeddings.

It was about understanding how the database interpreted our configuration.

The biggest learning for me was how important it is to read the documentation instead of relying on assumptions about how a library works.

I had initially looked at the configuration and assumed that passing `hnsw:space` with `cosine` was enough. But I hadn't paid enough attention to where that setting actually needed to go.

And that's what made this bug interesting. The code looked reasonable, Dev was working, and nothing immediately pointed towards the database initialization.

Sometimes, the problem isn't in the complicated part of the system. It's in a small detail that you haven't understood properly.

**Two days of debugging, and the answer was sitting in the documentation all along.**

— _Nikhil Gautam_