# Quick start guide

Guesty's Booking Engine API enables developers to integrate real-time availability, pricing, and booking functionality into external websites and applications. This guide helps you understand the basics and get up and running quickly.

## Overview

The Booking Engine API allows external platforms to:

* Search available properties

* Retrieve pricing and calendar data

* Create bookings

<br />

#### Key components

* **Base URL**: `https://booking-api.guesty.com/v1`

* **Format**: JSON over HTTPS

* **Authentication**: OAuth2 access token (included in header)

<br />

#### Prerequisites

* A Guesty account with Booking Engine enabled (see *Step 1* in the next section below)
* An API key (provided in the Guesty dashboard - see *Step 2* in the next section below)
* Familiarity with HTTP requests and JSON responses
* A tool for testing requests (Postman, curl, or browser)

<br />

## Activating the Booking Engine

### Step 1: Create a booking Engine API instance

To begin using the Booking Engine API, you need to create an API instance and retrieve your credentials (Client ID and Client Secret). Take care to ensure that you select the [booking option](https://help.guesty.com/hc/en-gb/articles/9366304056605-Creating-a-Booking-Engine-API-instance-Explained#booking-options) (*Only request to book*, *Only instant booking*, or *Both request to book and instant book*) that aligns with your intended booking flow. For example, if you select *Only Inquiries*, you will only be able to create [booking requests](https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote)  (`"status": "reserved"`).

📖 For detailed instructions, refer to this [Guesty Help Center article](https://help.guesty.com/hc/en-gb/articles/18132541671069-Creating-and-editing-a-Guesty-Booking-Engine-API-instance).

<br />

### Step 2: Get your access token

**Note**: Guesty enforces the following access token limitations:

* Tokens expire after 24 hours.
* Each application requires its own token.
* You can create up to 5 applications per Guesty account.
* The token can be renewed up to 3 times within a 24-hour period.

To avoid interruptions, store and reuse tokens until they expire.

<br />

<details>
  <summary><strong>Managing your token for uninterrupted access</strong></summary><br />
  <p>To maintain uninterrupted access and avoid exceeding token issuance limits, consider the following token management strategy:</p>

  <ul>
    <li>Store the token securely using environment-specific strategies:</li>

    <ul>
      <li>For backend services, use <strong>in-memory caching</strong> or <strong>encrypted secure files</strong>.</li>
      <li>If writing to disk, <strong>encrypt the file</strong> using a secure method and <strong>restrict file permissions</strong>.</li>
      <li><strong>Avoid</strong> committing tokens to source control.</li>
      <li><strong>Never</strong> store tokens in frontend or client-side code.</li>
    </ul>

    <li><strong>Track</strong> its expiration time using the `expires_in` field from the token response (usually 86400 seconds).</li>
    <li><strong>Reuse</strong> the stored token for all API requests until it is close to expiring.</li>
    <li>Automatically request a new token only when the current one is about to expire (e.g., within the last 5 minutes).</li>
    <li><strong>Avoid</strong> requesting a new token on every API call to prevent hitting the renewal limit of 3 tokens per 24 hours per application.</li>
  </ul>
</details>

<br />

To interact with the Booking Engine API, you'll need to authenticate using OAuth2 to obtain an access token. Here's how to request a token using your client credentials:

<br />

#### Request

```curl
curl --location --request POST 'https://booking.guesty.com/oauth2/token' \
--header 'accept: application/json' \
--header 'cache-control: no-cache,no-cache' \
--header 'content-type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=booking_engine:api' \
--data-urlencode 'client_secret={application client SECRET}' \
--data-urlencode 'client_id={application client ID}'
```

```node Node.js (axios)
const axios = require('axios');

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'booking_engine:api');
  params.append('client_id', 'YOUR_CLIENT_ID');
  params.append('client_secret', 'YOUR_CLIENT_SECRET');

  const response = await axios.post('https://booking.guesty.com/oauth2/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  console.log(response.data.access_token);
}
```

```python Python (requests)
import requests

payload = {
    'grant_type': 'client_credentials',
    'scope': 'booking_engine:api',
    'client_id': 'YOUR_CLIENT_ID',
    'client_secret': 'YOUR_CLIENT_SECRET'
}

response = requests.post('https://booking.guesty.com/oauth2/token', data=payload)
print(response.json()['access_token'])
```

```php PHP cURL
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://booking.guesty.com/oauth2/token');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'accept: application/json',
    'cache-control: no-cache,no-cache',
    'content-type: application/x-www-form-urlencoded'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'client_credentials',
    'scope' => 'booking_engine:api',
    'client_id' => 'YOUR_CLIENT_ID',
    'client_secret' => 'YOUR_CLIENT_SECRET'
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
echo $data['access_token'];
```

<br />

#### Response

```json
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

<br />

Use the `access_token` in the `Authorization` header of all subsequent API requests:

<br />

```curl
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
```

<br />

### Step 3: Test your access token with a listings search

**Request**:

```curl
curl --location GET 'https://booking-api.guesty.com/v1/search
accept: application/json' \
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
```

Optional query parameters include:

* `checkIn`, `checkOut` (YYYY-MM-DD)
* `guests`, `adults`, `children`
* `location`

<br />

**Example**:

```curl
curl --location --request GET 'https://booking-api.guesty.com/v1/search?checkIn=2025-07-01&checkOut=2025-07-05&adults=2' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
```

<br />

### Step 4: Activate the booking flow

Before using the Booking Engine (BE) API reservation endpoints, ensure it is properly activated by following these steps:

1. **Activate the*manual* source**: [Create a direct booking](https://help.guesty.com/hc/en-gb/articles/9358999571101-Creating-a-manual-reservation-for-a-single-listing) from your Guesty dashboard to activate the *manual* booking source in your account.
2. **Activate the Booking Engine API source**: Create your first reservation using the BE API [Reservation quote](https://booking-api-docs.guesty.com/reference/reservation-quote-1) endpoints. This step is essential to initialize the Booking Engine API source, which enables it as an automation option for additional fees, taxes, payment automations, and automated messages.

If you encounter any issues, feel free to [contact us](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Solutions#contact-guesty-from-the-dashboard)  for assistance.

<br />

## Rate limits

Guesty enforces the following rate limits on the Booking Engine API:

* **5 requests per second**
* **275 requests per minute**
* **16,500 requests per hour**

Guesty uses a gradual refill method to restore your request capacity over time, rather than resetting it all at once. This means you should avoid burst traffic and allow time for capacity to replenish between requests.

<br />

<details>
  <summary><strong>Recommendations</strong></summary><br />

  <ul>
    <li>Distribute traffic evenly across time to avoid bursts.</li>
    <li>Implement exponential backoff when you receive HTTP 429 (Too Many Requests) responses.</li>
    <li>Monitor API response headers for rate limit usage if exposed.</li>
  </ul>
</details>

<br />

## Best practices

* Always include the `Authorization` header
* Validate inputs before sending requests
* Handle 4xx and 5xx responses gracefully
* Display accurate availability and pricing by using real-time API data

<br />

> ⚠️ Note:
>
> Guesty recommends using the [Reservation Quote Flow](https://booking-api-docs.guesty.com/docs/new-reservation-creation-flow) for **all** booking operations. The older [Reservations V1](https://booking-api-docs.guesty.com/reference/reservations-v1) endpoint is being deprecated and **should not** be used in new implementations.

<br />

## Resources

* [Booking Engine API Documentation](https://booking-api-docs.guesty.com/reference/overview)
* [Listings Search Endpoint](https://booking-api-docs.guesty.com/reference/getsearch)
* [Create Booking Endpoint](https://booking-api-docs.guesty.com/reference/createreservationquote)
* [Response Codes](https://booking-api-docs.guesty.com/reference/response-codes)
* [Errors](https://booking-api-docs.guesty.com/reference/errors)
* [Definitions](https://booking-api-docs.guesty.com/reference/definitions)
* [Enums](https://booking-api-docs.guesty.com/reference/enums)

<br />

## Troubleshooting authentication issues

If you encounter authentication issues with the Booking Engine API, here are some common causes and tips:

<br />

### Common issues

<br />

<details>
  <summary><strong>Invalid client ID or secret</strong></summary><br />
  <p>Double-check credentials for typos and correct copying.</p><br />
</details>

<details>
  <summary><strong>Incorrect headers</strong></summary><br />
  <p>Ensure you include <code>Content-Type: application/x-www-form-urlencoded</code> and use <code>accept: application/json</code>.</p><br />
</details>

<details>
  <summary><strong>Token expiration</strong></summary><br />
  <p>Tokens expire after 24 hours. Cache and reuse the token as described.</p><br />
</details>

<details>
  <summary><strong>Token renewal limit</strong></summary><br />
  <p>Tokens can only be renewed 3 times in 24 hours. Avoid excessive regeneration.</p><br />
</details>

<details>
  <summary><strong>Missing authorization</strong></summary><br />
  <p>Include the header <code>Authorization: Bearer YOUR\_ACCESS\_TOKEN</code> in all requests.</p><br />
</details>

<br />

### Getting help

If issues persist, [contact Guesty support](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Experience).

<br />

## Next steps

* Explore the [Booking Engine API Documentation](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist)
* Review available filters and sort options for search
* Read through the [Booking Engine API Guides](https://booking-api-docs.guesty.com/docs/getting-started-with-guesty-booking) for implementation tips
* Implement error-handling and availability fallback logic