# Auto-Payment Policies (deprecated)

Display each listing's auto-payment policy, enabling your guests to see all the information they need.

<Callout icon="❗️" theme="error">
  **Deprecated and Replaced**

  This has been deprecated and replaced with  <Anchor label="Retrieve a payouts schedule for a listing" target="_blank" href="ref:retrievepayoutsschedule">Retrieve a payouts schedule for a listing</Anchor>
</Callout>

When it comes to financial transactions, trust and transparency is key. When a host processes payment for booking on fees agreed to by the guest and as expected, trust is built. You can retrieve your auto-payment policies via the Booking Engine API to publish to your website booking page or terms & conditions. This document explains how.

*Reference Docs*

* [Get a specific listing](https://booking-api-docs.guesty.com/reference/getapplicationlisting)

**Available Endpoints**

| Method | Endpoint                |
| :----- | :---------------------- |
| GET    | `/listings`             |
| GET    | `/listings/{listingId}` |

**Key Parameters**

Auto-payment rules are found on the listing object under the `autoPayments` object and its `policy` array. Learn more about auto-payments in our [Help Center](https://help.guesty.com/hc/en-gb/articles/9359001161629-Auto-Payments-Overview).

| Parameter      | Description                     | Data Type |
| :------------- | :------------------------------ | :-------- |
| `autoPayments` |                                 | object    |
| -- `policy`    | An array of auto-payment rules. | \[object]  |

You can retrieve the auto-payment policy through a request such as this one:

```shell
curl --location 'https://booking.guesty.com/api/listings/{listingId}?fields=autoPayments' \
--header 'Accept: application/json'
```

The following sections delineate the different payment rules.

## Authorization Hold

An authorization hold reserves a portion of a credit card's limit to ensure enough credit is available for the product or service. To learn how to configure one on Guesty, [click here](https://help.guesty.com/hc/en-gb/articles/9383300679965-Adding-an-Authorization-Hold-Automatically-Explained).

### Example 1: Capture Only

**Key Parameters**

| Parameter             | Description                                                                                                                | Data Type |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- | :-------- |
| `scheduleTo`          | [Learn more](https://help.guesty.com/hc/en-gb/articles/9383300679965-Adding-an-Authorization-Hold-Automatically-Explained) | object    |
| -- `timeRelation`     |                                                                                                                            | object    |
| --- `relation`        | The conditional operator. `AT` / `BEFORE` / `AFTER`                                                                        | string    |
| --- `unit`            | Unit of time. `MINUTES` / `HOURS` / `DAYS`                                                                                 | string    |
| --- `amount`          | Amount of time relative to the unit of time.                                                                               | number    |
| -- `reservationEvent` | Event that triggers the transaction (`CONFIRMATION` / `CHECK_IN` / `CHECK_OUT`).                                           | string    |
| `_id`                 | Payment rule ID                                                                                                            | string    |
| `chargeType`          | `PERCENTAGE` / `AMOUNT` / `REST_OF_PAYMENT`                                                                                | string    |
| `isAuthorizationHold` | Will be `true`.                                                                                                            | boolean   |
| `useGuestCard`        | Charge the guest's credit card (`true` / `false`).                                                                         | boolean   |
| `amount`              | The portion of the authorization hold to charge.                                                                           | number    |

*Capture* 10 percent of the reservation payout one hour *before* check-in.

```JSON
{
    "autoPayments": {
        "policy": [
            {
                "scheduleTo": {
                    "timeRelation": {
                        "relation": "BEFORE",
                        "unit": "HOURS",
                        "amount": 1
                    },
                    "reservationEvent": "CHECK_IN"
                },
                "_id": "64527886740d33005258ae80",
                "chargeType": "PERCENTAGE",
                "isAuthorizationHold": true,
                "useGuestCard": true,
                "amount": 10
            }
        ]
    }
}
```

### Example 2: Hold and Charge Captured Funds

This rule adds a charge automation to the capture rule.

**Key Parameters**

| Parameter                 | Description                                                                      | type    |
| :------------------------ | :------------------------------------------------------------------------------- | :------ |
| `chargeAuthorizationHold` | Charge the amount captured.                                                      | object  |
| -- `scheduleTo`           |                                                                                  | object  |
| --- `timeRelation`        |                                                                                  | object  |
| ---- `amount`             | Amount of time relative to the unit of time.                                     | integer |
| ---- `unit`               | `MINUTES` / `HOURS` / `DAYS`                                                     | string  |
| ---- `relation`           | The conditional operator. `AT` / `BEFORE` / `AFTER`                              | string  |
| --- `reservationEvent`    | Event that triggers the transaction (`CONFIRMATION` / `CHECK_IN` / `CHECK_OUT`). | string  |
| -- `inUse`                | Charge the hold. Will always be `true` when the rule is in effect.               | boolean |
| -- `chargeType`           | `PERCENTAGE` / `AMOUNT` / `REST_OF_PAYMENT`                                      | string  |

This example demonstrates a rule that *captures* a hold of 10% of the reservation payout one hour *prior* to check-in and *charges* the guest's credit card for the amount captured and hour *after* check-in.

```JSON
{
    "autoPayments": {
        "policy": [
            {
                "scheduleTo": {
                    "timeRelation": {
                        "relation": "BEFORE",
                        "unit": "HOURS",
                        "amount": 1
                    },
                    "reservationEvent": "CHECK_IN"
                },
                "chargeAuthorizationHold": {
                    "scheduleTo": {
                        "timeRelation": {
                            "amount": 1,
                            "unit": "HOURS",
                            "relation": "AFTER"
                        },
                        "reservationEvent": "CHECK_IN"
                    },
                    "inUse": true,
                    "chargeType": "REST_OF_PAYMENT"
                },
                "_id": "64527886740d33005258ae80",
                "chargeType": "PERCENTAGE",
                "isAuthorizationHold": true,
                "useGuestCard": true,
                "amount": 10
            }
        ]
    }
}

```

### Example 3: Hold and Release

This rule captures credit card funds and then releases them.

> 🚧 Hold Expiration
>
> The authorization hold will automatically expire seven days after it is activated. [Learn more](https://help.guesty.com/hc/en-gb/articles/9383300679965-Adding-an-Authorization-Hold-Automatically-Explained#release).

**Key Parameters**

| Parameter                  | Description                                                                      | type    |
| :------------------------- | :------------------------------------------------------------------------------- | :------ |
| `releaseAuthorizationHold` | Release the amount captured.                                                     | object  |
| -- `scheduleTo`            |                                                                                  | object  |
| --- `timeRelation`         |                                                                                  | object  |
| ---- `amount`              | Amount of time relative to the unit of time.                                     | integer |
| ---- `unit`                | `MINUTES` / `HOURS` / `DAYS`                                                     | string  |
| ---- `relation`            | The conditional operator. `AT` / `BEFORE` / `AFTER`                              | string  |
| --- `reservationEvent`     | Event that triggers the transaction (`CONFIRMATION` / `CHECK_IN` / `CHECK_OUT`). | string  |
| -- `inUse`                 | Charge the hold. Will always be `true` when the rule is in effect.               | boolean |
| -- `chargeType`            | `PERCENTAGE` / `AMOUNT` / `REST_OF_PAYMENT`                                      | string  |

*Capture* 10% of the payout one hours *prior* to check-in and *release* it three days *after* check-out.

```JSON
{
    "autoPayments": {
        "policy": [
            {
                "scheduleTo": {
                    "timeRelation": {
                        "relation": "BEFORE",
                        "unit": "HOURS",
                        "amount": 1
                    },
                    "reservationEvent": "CHECK_IN"
                },
                "releaseAuthorizationHold": {
                    "scheduleTo": {
                        "timeRelation": {
                            "amount": 3,
                            "unit": "DAYS",
                            "relation": "AFTER"
                        },
                        "reservationEvent": "CHECK_OUT"
                    },
                    "inUse": true,
                    "chargeType": "REST_OF_PAYMENT"
                },
                "_id": "64527886740d33005258ae80",
                "chargeType": "PERCENTAGE",
                "isAuthorizationHold": true,
                "useGuestCard": true,
                "amount": 10
            }
        ]
    }
}
```

## Charge the Credit Card

The auto-payment rules are flexible enough that the number of rules and their conditions can differ from listing to listing, property manager to property manager. This is one such example.

**Key Parameters**

| Parameter             | Description                                                                                                                | type    |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------ |
| `scheduleTo`          | [Learn more](https://help.guesty.com/hc/en-gb/articles/9383300679965-Adding-an-Authorization-Hold-Automatically-Explained) | object  |
| -- `timeRelation`     |                                                                                                                            | object  |
| --- `relation`        | The conditional operator. `AT` / `BEFORE` / `AFTER`                                                                        | string  |
| --- `unit`            | Unit of time. `MINUTES` / `HOURS` / `DAYS`                                                                                 | string  |
| --- `amount`          | Amount of time relative to the unit of time.                                                                               | number  |
| -- `reservationEvent` | Event that triggers the transaction (`CONFIRMATION` / `CHECK_IN` / `CHECK_OUT`).                                           | string  |
| `_id`                 | Payment rule ID                                                                                                            | string  |
| `chargeType`          | `PERCENTAGE` / `AMOUNT` / `REST_OF_PAYMENT`                                                                                | string  |
| `isAuthorizationHold` | Will be `false`.                                                                                                           | boolean |
| `useGuestCard`        | Charge the guest's credit card (`true` / `false`).                                                                         | boolean |
| `amount`              | Amount to charge.                                                                                                          | number  |

*Charge* the guest 50% *at* confirmation and the rest two days *before* check-in.

```JSON
{
    "autoPayments": {
        "policy": [
            {
                "scheduleTo": {
                    "timeRelation": {
                        "relation": "AT",
                        "unit": "HOURS",
                        "amount": 1
                    },
                    "reservationEvent": "CONFIRMATION"
                },
                "_id": "645282d55fc865003ac7887f",
                "chargeType": "PERCENTAGE",
                "isAuthorizationHold": false,
                "useGuestCard": true,
                "amount": 50
            },
            {
                "scheduleTo": {
                    "timeRelation": {
                        "relation": "BEFORE",
                        "unit": "DAYS",
                        "amount": 2
                    },
                    "reservationEvent": "CHECK_IN"
                },
                "_id": "6452836cc666df0051636699",
                "chargeType": "REST_OF_PAYMENT",
                "isAuthorizationHold": false,
                "useGuestCard": true
            }
        ]
    }
}
```