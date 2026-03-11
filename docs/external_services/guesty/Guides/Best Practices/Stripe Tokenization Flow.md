# Stripe Tokenization Flow

Tokenize the credit card in Stripe to use it for guest payment.

## Overview

There are three primary steps to creating a guest payment method for reservations.

1. Determine the integrated payment processor account that is assigned to the listing.
2. Collect and tokenize the guest's credit card in the Stripe account identified in the first step.
3. Add it as the `ccToken` in the reservation creation request.

<br />

<Image alt="Create a Guest Payment Method Sequence Diagram" align="center" width="500px" border={true} src="https://files.readme.io/0ab1d02-BEAPI_Stripe_Guest_Payment_Method.jpg">
  Figure 1.0. Create a Guest Payment Method Flow
</Image>

<br />

> ❗️ Important
>
> * Before Guesty can process Stripe payments for bookings, **a Stripe account must be connected with your Guesty account**. [Learn more](https://help.guesty.com/hc/en-gb/articles/9369937520285-Connecting-a-Stripe-Account-to-Guesty).
> * Be sure to **obtain[Stripe API Keys](https://docs.stripe.com/keys) for each Guesty-connected account** to generate the necessary payment method token to capture payments through Guesty(as explained in *Step 2* below).

<br />

## Step 1: Identify the Payment Processor Account

The payment method token must come from the same payment processor account integrated with your Guesty account and assigned to the given listing. Use the following request to retrieve the details of the Stripe account assigned to the property:

* [Get payment provider by listing id](https://booking-api-docs.guesty.com/reference/getpaymentproviderbylistingid)

<br />

#### Example

*Request*

```curl
curl --globoff 'https://booking.guesty.com/api//listings/{id}/payment-provider' \
--header 'accept: application/json; charset=utf-8' \
--header 'Authorization: Bearer {token}'
```

```javascript
const myHeaders = new Headers();
myHeaders.append("accept", "application/json; charset=utf-8");
myHeaders.append("Authorization", "Bearer {token}");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "manual"
};

fetch("https://booking.guesty.com/api//listings/{id}/payment-provider", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

```node
var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'booking.guesty.com',
  'path': '/api//listings/{id}/payment-provider',
  'headers': {
    'accept': 'application/json; charset=utf-8',
    'Authorization': 'Bearer {token}'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();
```

```php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://booking.guesty.com/api//listings/{id}/payment-provider',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => false,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'accept: application/json; charset=utf-8',
    'Authorization: Bearer {token}'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

```

```python
import http.client

conn = http.client.HTTPSConnection("booking.guesty.com")
payload = ''
headers = {
  'accept': 'application/json; charset=utf-8',
  'Authorization': 'Bearer {token}'
}
conn.request("GET", "/api//listings/{id}/payment-provider", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```

<br />

*Response*

```json
{
    "_id": "string",
    "providerType": "stripe",
    "providerAccountId": "acct_<string>",
    "status": "ACTIVE",
    "paymentProcessorName": "Stripe",
    "accountName": "Main Stripe Account",
    "paymentProcessorId": "string"
}
```

<br />

## Step 2: Tokenize the Guest's Card

Authenticate using the Stripe key of the connected Stripe account associated with the given listing to [generate a payment method token](https://stripe.com/docs/api/payment_methods/create) from the assigned Stripe account for the Guesty listing. **For this purpose, you must develop your own Stripe integration with your application**.

<br />

> 🚧 Note
>
> Take care to create **only the payment token** in Stripe, and not the customer (guest). Guesty will create the guest the first time it charges the card.

<br />

## Step 3: Create the Reservation

Pass the Stripe payment token as the `ccToken` in the [inquiry](https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote) or [instant booking](https://booking-api-docs.guesty.com/reference/createinstantreservationfromquote) request.

<br />

## Reuse of Tokens

Using the same payment token for multiple reservations is not supported. It will result in a missing payment method error in the user dashboard (even though it exists), preventing [auto payments](https://help.guesty.com/hc/en-gb/articles/9385884874653-Auto-Payments-Best-practices) from being executed as scheduled. Generate a new token for each new [inquiry](https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote) or [reservation](https://booking-api-docs.guesty.com/reference/createreservationquote) through the Booking Engine API.

<br />

## Troubleshooting

<details>
  <summary><b>The reservation was created without a payment method</b></summary>

  <p />

  <p>This may be due to either of the following:</p>

  <ol>
    <li>The credit card was tokenized in a different payment processor account than the one assigned to the listing. Determine the correct account using the <a href="ref:getpaymentproviderbylisting" target="_blank">Get payment provider by listing</a> and <a href="ref:getstats" target="_blank">Get provider stats</a>.</li>
    <li>The payment processor or credit card issuer reported an issue. Check your payment processor extranet for error messages and see our <a href="https://help.guesty.com/hc/en-gb/sections/15631615610397" target="_blank">Help Center troubleshooting articles</a>.</li>
  </ol>
</details>

<details>
  <summary><b>How can I be sure the payment method succeeded?</b></summary>

  <p />

  <p>Retrieve the reservation object. Its payload will show the payment method object nested under the <code>money.payments</code> section.</p>
</details>

<details>
  <summary><b>Stripe Payment Error</b>: <code>This PaymentMethod was previously used without being attached to a Customer or was detached from a Customer and may not be used again.</code></summary>

  <p />

  <p>This occurred because you created the customer in Stripe. This links the token with that customer and prevents Guesty from using it. You must only create the payment token in Stripe. Guesty will create the Stripe customer when it validates the token.</p>
  <p>You can prevent this by implementing the following:</p>

  <ol>
    <li>Omit the pre-charge and subscribe to the <a href="doc:webhooks-payments" target="_blank">payment.failed</a> webhook to monitor for failed payments on the reservations.</li>
    <li> Tokenize the card again after you have completed the check and send Guesty a fresh <em>pm token</em></li>
  </ol>
</details>