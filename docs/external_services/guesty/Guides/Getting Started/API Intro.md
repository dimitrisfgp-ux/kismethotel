# API Intro

> 📘 Contact our team
>
> If you're having trouble, [contact us](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Solutions#contact-guesty-from-the-dashboard) at for assistance!

# API Base URL

The **base URL** for the Booking Engine API is:

`https://booking.guesty.com/api/`

All data should be sent in JSON format and with a `Content-Type: application/json header`.

Note: All Guesty APIs are served over HTTPS only for security reasons.

# Authentication & Security

The Guesty Booking Engine API uses a JSON Web Token for client authentication.

# Restrictions:

* Tokens expire after 24 hours.
* Each application requires its own token.
* You can create up to 5-applications per single Guesty account.
* **The token can be renewed up to 3 times within the 24-hour period**.

To generate an access token, please see the [Authentication section](https://guesty-booking.readme.io/docs/authentication-1).

# How to Secure Client Credentials (CC)

Tokens are super confidential - you should always protect them, and only communicate using an encrypted backend-to-backend API connection to the Booking Engine.

> ❗️ Protect Your Access
>
> Do not send any tokens or your client secret (or full authorization headers!) through email or other non-secure channels - in fact, we recommend excluding them from your code, and only loading them as environment variables.

# Rate Limits

A rate limit is the maximum number of calls allowed within a particular time interval. Setting rate limits enables Guesty to manage the network traffic for our APIs and for specific operations within our APIs.

You can perform all supported actions through the Booking Engine API; the rate limits enforce a stable data flow. The amount of data that can be sent and received must occur at a controlled rate or number of actions to ensure continuous and unimpeded data flow.

Rate limits can be **hard** (enforced) or **soft**. If the rate limit is hard and a call exceeds the limit, then the call is aborted, and an error is returned. A soft rate limit allows the call to complete but logs a warning message. When a hard rate limit is reached, no more calls are accepted from your account until the beginning of the next time period.  For example, say the API permits a total of 1000 calls per hour (rate limit). If you make 1000 calls in the first 10 minutes, you cannot complete any more calls until the hour has expired.

Guesty enforces **hard limits** and provides you with the amount of time you need to wait within the API response (see the [Handling Rate Limits](#handling-rate-limits) section for specific details).

Here are the rate limits for all API endpoints:

| Maximum Number of Requests | Time Frame |
| :------------------------- | :--------- |
| 5                          | One second |
| 275                        | One minute |
| 16,500                     | One hour   |

**Guesty processes and restores your API requests at a constant rate** whether you send them in bursts or at a constant rate yourself. As a result, your rate quotas may remain higher than you expect (which is by design). However, if you do attempt to send **more than 15 concurrent requests**, you’ll be instantly rate limited, and if you continue with this approach, you’ll start to see each rate limit quota decrease.

> 📘 Note
>
> The rate limits apply to all call methods (`POST `/ `PUT` / `GET` / etc.).

## Handling Rate Limits

To correctly address rate limits, you are required to implement a retry mechanism.

When an "HTTP 429 too many requests" response code is returned, the subsequent request should be queued for the duration of the seconds detailed in the "Retry-after" response header.

> ❗️
>
> If you hit a rate limit, Guesty will respond with a **"429 Too Many Requests"** status code.