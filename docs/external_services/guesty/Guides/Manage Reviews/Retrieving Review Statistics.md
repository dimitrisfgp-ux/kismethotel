# Retrieving Review Statistics

Retrieve a listing's average review score.

## Introduction

A business lives and dies by its reputation. The *average review score* of a listing is a good indicator of its performance and popularity over time. The *average review score* represents the average rating of all the listing reviews Guesty receives from [Airbnb](https://www.airbnb.com/help/topic/1391/reviews) and [Booking.com](https://partner.booking.com/en-gb/help/guest-reviews), combined and graded on a scale between 1-10.

The *average review score* is a new listing parameter that is returned as part of the listing object. Please refer to the [API Explorer](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist) for more information.

## The Reviews Object

The `reviews` object is composed of the following parameters.

| Body Parameter | Details                          | Data Type |
| :------------- | :------------------------------- | :-------- |
| reviews        | The average review score object. | Object    |
| -- avg         | The average score.               | Float     |
| -- total       | The number of reviews received.  | Integer   |

**Example**

```json
{
  "reviews": {
        "avg": 10,
        "total": 2
      }
}
```

## Available Endpoints

One endpoint can be used to retrieve the review score of multiple listings or just a single listing's score.

| Method | Endpoint                    |
| :----- | :-------------------------- |
| GET    | `/api/listings`             |
| GET    | `/api/listings/{listingId}` |

## Retrieving All Average Review Scores

This `GET` request retrieves all the average review scores.

```curl
curl --location --request GET 'https://booking.guesty.com/api/listings?fields=_id title reviews' \
--header 'authorization: Bearer {{Token}}'
```

**Recommended Query Parameters**

To ensure that the review score matches a listing, we recommend including the following parameters as a minimum requirement, and you are free to include other listing fields.

| Query Parameter | Details                                                 |
| :-------------- | :------------------------------------------------------ |
| \_id            | The unique Guesty ID assigned to the listing.           |
| title           | The official name under which the listing is marketed.  |
| reviews         | The reviews object containing the average review score. |

For an example of a successful response, see our API Explorer page [here](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist).

## Retrieving a Single Average Review Score

This `GET` request retrieves the average review score for a single listing.

```curl
curl --location --request GET 'https://booking.guesty.com/api/listings/{listingId}?fields=reviews' \
--header 'authorization: Bearer{{Token}}'
```

Unlike the request to retrieve all average review scores, the identity of the listing is known, so the only additional query parameter required (at a minimum) is `reviews`. To view a sample response, see our [API Explorer page](https://booking-api-docs.guesty.com/reference/getapplicationlisting).

## Suggested Use Case

The average review score is intended to be used to promote your listing and can be used anywhere on your website, such as in the listings search results or on the listing page itself.