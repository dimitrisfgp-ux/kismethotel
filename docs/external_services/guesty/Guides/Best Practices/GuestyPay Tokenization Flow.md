# GuestyPay Tokenization Flow

How to safely tokenize credit card details for the GuestyPay payment method.

## Overview

There are two primary steps to creating a guest payment method through GuestyPay for reservations.

1. Collect and tokenize the guest's credit card.
2. Pass the token in the reservation creation request.

<Image align="center" border={true} caption="Figure 1.0. GuestyPay Tokenization Flow" src="https://files.readme.io/d09ba67-BEAPI_Guest_Payment_Method_Tokenization_with_GuestyPay.jpg" />

<br />

## Step 1: Tokenize the Guest's Card

<br />

> 📘 Determine the Payment Processor ID
>
> The API will automatically identify a property's payment processor when you include the `listingId` in your tokenization request. Even then, it is a best practice to include the `paymentProviderId` as well. You can retrieve it with the following request.
>
> * [Get payment provider by listing id](https://booking-api-docs.guesty.com/reference/getpaymentproviderbylistingid)

<br />

### Payment Form and SDK

The quickest, easiest, and **recommended** way to facilitate payments on your website is by using our payment form SDK. Guesty offers a JavaScript SDK that supports multiple payment methods, ensuring that your guests enjoy a personalized and hassle-free checkout process. It's secure and PCI-compliant. You can access it at the links below.

* [GitHub Wiki](https://github.com/guestyorg/tokenization-js/wiki)
* [NPM package](https://www.npmjs.com/package/@guestyorg/tokenization-js?activeTab=readme)

Please note that the SDK supports the [GuestyPay](https://help.guesty.com/hc/en-gb/articles/9361476868637-Welcome-to-GuestyPay) and <Anchor label="Merchant Warrior" target="_blank" href="https://help.guesty.com/hc/en-gb/articles/9362439480605-Connecting-a-Merchant-Warrior-account-to-Guesty">Merchant Warrior</Anchor> payment processors.

<br />

#### Resources

> ❗️ Directly Interfacing with the API
>
> Interfacing with the API directly, using the resources outlined below, should only be attempted if the SDK cannot be adapted for your use case. Even then, please contact [Customer Experience](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Experience)  and we will assist you with it. We plan to offer the SDK as the only method in the near future.

<br />

**Available Endpoints**

| Method | Endpoint                                 |
| :----- | :--------------------------------------- |
| POST   | `https://pay.guesty.com/api/tokenize/v2` |

**Payload**

| Body Parameter      | Data Type | Description                                                                                                        | Required |
| :------------------ | :-------- | :----------------------------------------------------------------------------------------------------------------- | :------: |
| `paymentProviderId` | string    | The payment processing account ID as stored in Guesty - [Learn more](https://booking-api-docs.guesty.com/reference/getpaymentproviderbylistingid).           |    ✔️    |
| `listingId`         | string    | The ID of the property being booked.                                                                               |    ✔️    |
| `card`              | object    | [Credit card details](https://booking-api-docs.guesty.com/docs/guestypay-tokenization-flow#card-object).                                                |    ✔️    |
| `billing_details`   | object    | [Billing details](https://booking-api-docs.guesty.com/docs/tokenizing-payment-methods#billing-details-object).                                          |    ✔️    |
| `threeDS`           | object    | [3D Secure validation](https://booking-api-docs.guesty.com/docs/tokenizing-payment-methods#threeds-object) (refer to the *threeDS Object* table below). |    ✔️    |
| `merchantData`      | object    | See the [Merchant Data](https://booking-api-docs.guesty.com/docs/guestypay-tokenization-flow#merchant-data) section below.                              |          |

#### Card Object

This table describes the parameters of the `card` object from the *Payload* table above.

<br />

| Body Parameter | Data Type | Description                                            | Required |
| :------------- | :-------- | :----------------------------------------------------- | :------: |
| `number`       | string    | Credit card number.                                    |    ✔️    |
| `exp_month`    | string    | Expiration month in 2 digits string format (`"04"`).   |    ✔️    |
| `exp_year`     | string    | Expiration year in 4 digits string format (`"2024"`).  |    ✔️    |
| `cvc`          | string    | Card verification code. Three digits in string format. |    ✔️    |

#### Billing Details Object

These are the parameters of the `billing_details` object from the *Payload* table above.

<br />

| Body Parameter    | Data Type | Description                                                               | Required |
| :---------------- | :-------- | :------------------------------------------------------------------------ | :------: |
| `name`            | string    | Cardholder's name.                                                        |    ✔️    |
| `address`         | object    | Card's billing address.                                                   |    ✔️    |
|     `city`        | string    | City. Max length 50 characters.                                           |    ✔️    |
|     `country`     | string    | The [ISO 3166 Alpha-2](https://www.iban.com/country-codes)  country code. |    ✔️    |
|     `line1`       | string    | Street name and number. Max length 50 characters.                         |    ✔️    |
|     `postal_code` | string    | Postal code. Max length 20 characters.                                    |    ✔️    |

#### threeDS Object

Guesty offers two parameters that can help guide the user toward the next step in your booking process after an authentication attempt.

1. `successURL` is the next step in your booking flow after a successful authentication attempt. For example, post the token as the guest's payment method and send the user a booking confirmation message.

2. `failureURL` is the next step in your process after authentication fails. Your website/application should redirect the guest to the relevant page to either try again, provide an alternate payment method, or follow any other process you have in place for invalid credit cards.

3. <br />

| Body Parameter | Data Type | Description                                       | Required |
| :------------- | :-------- | :------------------------------------------------ | :------: |
| `amount`       | number    | The total amount of the future payment.           |    ✔️    |
| `currency`     | string    | The currency code. E.g. `"USD"`                   |    ✔️    |
| `successURL`   | string    | URL for redirect after successful authentication. |          |
| `failureURL`   | string    | URL for redirect after a failed authentication.   |          |

<br />

> 🚧 Success and Failure URLs
>
> If you don't provide any URLs, the user will be redirected to a blank white page after attempting to authenticate. To avoid this, we suggest specifying the URL of the next step in your booking process, based on the authentication result, for a better user experience.

<br />

#### Merchant Data

| Body Parameter           | Data Type | Description                                                                    | Required |
| :----------------------- | :-------- | :----------------------------------------------------------------------------- | :------: |
| `freeText`               | string    | Any text you may wish to retain for future reference. E.g., "PayeeId-1234567". |          |
| `transactionDate`        | string    | The ISO 8601 date and time (YYYY-MM-DDTHh:Mm.ss.sssZ).                         |          |
| `transactionDescription` | string    | Define your transaction for ease of reference.                                 |          |
| `transactionId`          | string    | Enter the transaction ID you require for your systems.                         |          |

<br />

#### Example

**Request**

```curl
curl --location 'https://pay.guesty.com/api/tokenize/v2' \
--header 'Content-Type: application/json' \
--data '{  
    "listingId": "64f03f9094d741004fda977d",
    "card": {
        "number": "4580458045804580",
        "exp_month": "12",
        "exp_year": "2024",
        "cvc": "123"
    },
    "billing_details": {
        "name": "John Smith",
        "address": {
            "line1": "20 W 34th St",
            "city": "New York",
            "postal_code": "10001",
            "country": "US"
        }
    },
     "threeDS": {
        "amount": 500,
        "currency": "USD",
        "successURL": "https://book.pms.com?{orderN}",
        "failureURL": "https://book.pms.com/fail?{orderN}"
    },
     "merchantData": {
        "freeText": "PayeeId-1234567",
        "transactionDate": "2023-11-14T12:12:33.162Z",
        "transactionDescription": "Descriptor",
        "transactionId": "Reservation-2000583"
    }
}

 
```

<br />

**Response**

| Body Parameter | Data Type | Description                                                                                          |
| :------------- | :-------- | :--------------------------------------------------------------------------------------------------- |
| `_id`          | string    | The ID of the newly tokenized card. Pass this as the `ccToken` in your reservation creation request. |
| `threeDS`      | object    | Contains the authentication URL (`"authURL"`).                                                       |

<br />

Send the `authURL` to the user to authenticate the payment method. Once the authentication process is complete, the user is redirected to either the `successURL` or `failureURL` specified in the tokenization request, depending on the outcome.

If authentication is successful no `authURL` is returned in the response (the issuer didn't require it), you may proceed to use the token`_id` to create the guest payment method.

<br />

**Response**

```json
{
    "_id": "64d4d01f1884841581a7768e",
    "threeDS": {
        "authURL": "https://api.checkout.com/sessions-interceptor/sid_.....",
    }
}
```

<br />

## Step 2: Create the Reservation

Pass the GuestyPay token you've generated as the `ccToken` in the [Create inquiry for reservation based on quote](https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote) or [Create instant reservation based on quote](https://booking-api-docs.guesty.com/reference/createinstantreservationfromquote) requests.

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

  <p>The reservation object payload will show the payment object, nested under the <code>money.payments</code> section.</p>
</details>

<details>
  <summary><b>Error 402: <code>ERR\_BAD\_REQUEST</code></b></summary>

  <p />

  <p>When the data of your response contains the messages: <i>"Request contradicts clearing interface configuration"</i> and<i>"Bad Bin or Host Disconnect",</i> it means there is an issue with your GuestyPay account and it could be offline. To remedy this, contact <a href="https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Experience" target="_blank">Customer Experience</a>.</p>
</details>