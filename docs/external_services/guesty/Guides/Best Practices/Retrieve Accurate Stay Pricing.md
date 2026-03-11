# Retrieve Accurate Stay Pricing

How to retrieve the total price of a booking to provide guests with accurate final prices.

## Overview

You have two price options in the Booking Engine API:

1. **Base Price**: Just the default nightly rates, without additional calculations.
2. **Total Price**: The total cost, including all fees, taxes, and cleaning charges.

This guide explains how to retrieve the total price so you can provide guests with an accurate final cost for their stay.

<br />

## Retrieving the total price

### Key Endpoint

This total price is an extension of the current [listings search endpoint](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist).

| Method | URL                                                                                |
| :----- | :--------------------------------------------------------------------------------- |
| GET    | [https://booking.guesty.com/api/listings](https://booking.guesty.com/api/listings) |

<br />

To retrieve the accurate total price, you need to include specific path parameters. Using the given parameters, Guesty will identify the minimum rate plan price and return it as the new totalPrice field at the listing level.

<br />

### Key Parameters

To receive the final price, ensure your query includes these path parameters as a minimum requirement.

| Path Parameter | Details                                                                           | Example                                                         | Required |
| :------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------- | :------- |
| `fields`       | Specify the listing fields you require. They must include `totalPrice` and `_id`. | `fields=totalPrice _id address city title accommodates reviews` | true     |
| `checkIn`      | The check-in date in ISO format (YYYY-MM-DD).                                     | `2026-04-02`                                                    | true     |
| `checkOut`     | The check-out date in ISO format (YYYY-MM-DD).                                    | `2026-04-12`                                                    | true     |

<br />

### Example

#### Request

Here is an example request with the required parameters and a few other listing fields

```curl
curl --location 'https://booking.guesty.com/api/listings?minOccupancy=5&numberOfBedrooms=4&numberOfBathrooms=2&fields=_id%20address.city%20title%20accommodates%20reviews%20totalPrice&checkIn=2026-04-02&checkOut=2026-04-09&limit=20' \
--header 'accept: application/json; charset=utf-8' \
--header 'Authorization: Bearer {token}'

```

<br />

#### Successful response

```json
{
  "results": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Beautiful Beach House",
      "accommodates": 6,
      "totalPrice": 1250.50
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Downtown Apartment",
      "accommodates": 4,
      "totalPrice": 850.00
    }
  ],
  "pagination": {
    "total": 2,
    "cursor": {
      "next": null
    }
  }
}

```

<br />

## Important Behaviors

### The totalPrice Field

* The totalPrice field represents the total amount for the entire stay in the property's local currency. It includes the base rate, cleaning and service fees, taxes, and any other mandatory charges.
* For each listing, we internally call the [Create a reservation quote](https://booking-api-docs.guesty.com/reference/createreservationquote) endpoint to calculate the final price for each rate plan associated with the listing.
* The system will determine the minimum rate plan price and return it as the new `totalPrice` value at the listing level.

### Result Limit and Pagination

* **Limited Results:** With totalPrice, you can retrieve up to 50 results per request using the available filters and sorting options (applied to the listing's base price).
* **No Pagination**:  Final price requests do not support pagination cursors. The `pagination.cursor.next` will always be `null`.

```json
{
  "results": [...],
  "pagination": {
    "total": ...,
    "cursor": {
      "next": null
    }
  }
}

```

<br />

### Filters

Filters and sorting based on the listing's base price can be included in your request; they will affect how the results are presented:

* If your request filters by price, the API will automatically apply an additional filter on `totalPrice`.

* If your request is sorted by price, the API will first sort listings by `listing.basePrice`, then by `totalPrice`. In this scenario, you may receive fewer than 50 results.

<br />

## Troubleshooting

If you are unable to retrieve the `totalPrice` or believe there is an error in the final price calculation, please [contact](https://help.guesty.com/hc/en-gb/articles/9370047984413-Contacting-Customer-Experience) Guesty's Customer Experience Team.