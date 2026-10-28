# Assignment 3 – Interview Answers

## Initial Predictions

Before coding, I expected the profile and preview to load on the server. I expected all posts to load in the browser after clicking the button.

I also expected Suspense to show Loading and HTTP 503 to need a manual error check.

## 1. Where does each request run?

The Employee Profile runs on the server.

The Recent Posts Preview is intended to run on the server.

The Load Posts request runs in the browser after clicking the button.

I can use the Network tab to check browser requests. The independent preview still needs verification.

## 2. Why server fetching and client fetching?

I use server fetching to show employee information when the page loads.

I use client fetching because I want to load all posts only when the user clicks the button.

## 3. Why use Suspense?

Suspense shows a loading message while the server preview is waiting.

A normal button fetch does not automatically use Suspense, so I use React state for Loading.

## 4. What happens if Suspense covers the whole dashboard?

The whole dashboard could show Loading.

I prefer a separate Suspense because the other sections can stay visible.

## 5. Why use ApiError and super(message)?

ApiError helps me handle HTTP errors and store the status code.

`super(message)` sends the error message to the parent Error class.

## 6. HTTP error vs Network error vs Empty

- **HTTP error:** The API returns an error status like 503.
- **Network error:** The request cannot complete because of a connection problem.
- **Empty:** The request succeeds but returns no posts.

## 7. What happens if Employee ID changes from 1 to 2?

The application should show employee 2's information and posts if I change the ID in all three requests. I have not tested this change.

## 8. What did you test yourself?

I tested four scenarios:

- **Success:** Posts appeared.
- **Slow:** Loading appeared.
- **HTTP Error:** An error message appeared.
- **Empty:** No posts found appeared.

I still need to test the independent server preview.

## AI Assistance

I used AI to help me understand the code.

I chose to use `useEffect` with a button-triggered request so posts do not load automatically.

I checked the four demo scenarios myself.

## What I Learned

I learned the difference between Server Components and Client Components.

I learned how to use Suspense, useState, useEffect, and ApiError.

I also learned how to handle loading and errors.
