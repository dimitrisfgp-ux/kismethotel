# Requesting a Test Environment

Submitting a request for a Sandbox environment.

Guesty's Booking Engine API offers you a **Sandbox environment** to conduct your tests without affecting your production data. Please get in touch with your **Customer Success Manager** or reach out to our [Customer Solutions team](https://support.guesty.com/en/contact) to request the sandbox environment for your account.

> ❗️ Important
>
> * A token fee may be charged for the Sandbox.
>   * The Sandbox is limited to one Booking Engine API application.

## Sandbox Environment Base URL

`https://booking-sandbox.guesty.com/`

### Sandbox API Request Examples

**Retrieving Specific Listings**\
`https://booking-sandbox.guesty.com/api/listings/cities?limit=100&searchText=york`

**The Reservations API**\
`https://booking-sandbox.guesty.com/api/reservations`

## Authentication

The [authentication method](https://booking-api-docs.guesty.com/docs/authentication-1) is the same as for the production app, except for the base URL pointing to the Sandbox API and the authentication keys from your Booking Engine API app in your Sandbox account.

> 📘 Note
>
> To test **Instant Book** reservations, create valid and invalid payment tokens using [Stripe's test credit cards](https://stripe.com/docs/testing). See our [booking flows](https://booking-api-docs.guesty.com/docs/booking-flow#processing-payment-models) for more details