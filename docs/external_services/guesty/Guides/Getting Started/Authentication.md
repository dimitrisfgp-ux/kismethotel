

# Authentication

How to authenticate Booking Engine API requests.

> 📘 Contact our team
>
> If you're having trouble, contact us at [booking-engine-support@guesty.com](mailto:booking-engine-support@guesty.com) for assistance!

<br />

## Generating Client ID and Client Secret for your booking engine API instance

<br />

#### Step by step:

<br />

1. Sign in to your Guesty account.
2. In the top menu, hover over *Growth*.
3. From the drop-down, select *Distribution*.
4. Click the *Booking Engine API* thumbnail.
5. Click *Create a new API key*.
6. Fill in the required information: Learn more [here](https://support.guesty.com/kb/en/article/creating-a-booking-engine-api-instance-explained).
7. Click *Save*.
8. Locate the relevant key pair, and use the copy icon to the right of each credential to copy your *Client secret* and *Client ID* and share them with your developer.

<br />

In the example request below, fill in your `client_secret` and `client_id` and send your request

<br />

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

<br />

The response will contain the access token, token type, expiration time in seconds, and the scope.

<br />

```json
{
    "token_type": "Bearer",
    "expires_in": 86400,
    "access_token": "token body",
    "scope": "booking_engine:api"
}
```

<br />

## Using Your Access Token

<br />

> ❗️ Proper Authentication
>
> Booking Engine API (BEAPI) access keys are for authenticating **BEAPI requests only**. To authenticate requests to our Open API, please follow its authentication steps [here](https://open-api-docs.guesty.com/docs/authentication).

<br />

The `access_token` expires every 24 hours, so it must be refreshed once a day using your `client_id` and `client_secret`.

To minimize the chance of errors, the best practice is to store the value of the `expires_in` field locally and ensure your token is refreshed before it expires.

**To avoid the rate limits on the auth endpoint**, we advise hitting the auth endpoint once a day and caching the token for 24 hours. Then reuse that same token for any other Guesty endpoint requests within that 24-hour period.

For example:

1. Request auth token from auth endpoint
2. Cache the token
3. Request Listings (using the cached token)
4. Request Listing Detail (using the same cached token)
5. ... and so on for as many requests as needed ...
6. 24 hours later: Request a new auth token
7. Cache the new token
8. Repeat steps 3-7

<br />

## Troubleshooting authentication issues

If you encounter authentication issues with the Booking Engine API, here are some common causes and tips:

### Common issues

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

### Getting help

If issues persist, [contact Guesty support](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Experience).

<br />

> 📘 Read more
>
> You can read more about the booking engine API instance creation in our help center articles <a href="https://help.guesty.com/hc/en-gb/articles/9358993960605-Booking-Engine-API-Overview" target="_blank">here</a>.