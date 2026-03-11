# Guest and Host Reviews

Retrieve Guest and Host Reviews

The reviews API makes it easy to retrieve the published guest review of a listing and the published host review of the guest per reservation for bookings made via *Airbnb* or *Booking.com*. The reviews will include:

* Guest name
* Listing ID
* Reservation ID / Confirmation code
* The review content

> 📘 Tip
>
> Once the booking channel releases the reviews for public consumption, you have the opportunity to further promote your business by publishing them to your website.

Please refer to the[ API Explorer](https://booking-api-docs.guesty.com/reference/getreviewslist) for more information.

## Endpoint

| Method | Endpoint     |
| :----- | :----------- |
| GET    | /api/reviews |

## Airbnb Review Object

This table delineates the fields that constitute the Airbnb review data supplied by the Booking Engine.

|                                   |                                                                                                      |                 |
| :-------------------------------- | :--------------------------------------------------------------------------------------------------- | :-------------- |
| rawReview                         | Object containing the review data.                                                                   | Object          |
| -- id                             | The internal Guesty ID of the review.                                                                | String          |
| -- reviewer\_role                  | Defines the reviewer. E.g. `"guest"`.                                                                | String          |
| -- reviewer\_id                    | The Airbnb guest ID.                                                                                 | Integer         |
| -- reviewee\_role                  | Defines the recipient of the review. E.g. `"host"`.                                                  | String          |
| -- reviewee\_id                    | The Airbnb host ID.                                                                                  | Integer         |
| -- listing\_id                     | The Airbnb listing ID.                                                                               | Integer         |
| -- reservation\_confirmation\_code  | The Airbnb reservation confirmation code. E.g. `"HMTZ9DWB9W"`.                                       | String          |
| -- hidden                         | Whether the review remains hidden from public view.                                                  | Boolean         |
| -- submitted                      | Whether the review has been submitted for publishing.                                                | Boolean         |
| -- overall rating                 | The guest's overall rating of their stay.                                                            | Integer / Float |
| -- public\_review                  | The content of the review.                                                                           | String          |
| -- id\_str                         | -                                                                                                    | String          |
| -- reviewer\_id\_str                | Airbnb guest ID.                                                                                     | String          |
| -- reviewee\_id\_str                | Airbnb host ID.                                                                                      | String          |
| -- listing\_id\_str                 | Airbnb listing ID.                                                                                   | String          |
| -- expires\_at                     | E.g. `"2022-07-15T06:15:05.198Z"`.                                                                   | String          |
| -- first\_completed\_at             | Date and time the review was written. E.g. '"2022-07-14T11:44:02.563Z"\`.                            | String          |
| -- submitted\_at                   | Date and time the review was submitted. E.g. `"2022-07-14T11:44:55.556Z"`.                           | String          |
| -- category\_ratings\_accuracy      | Measures the accuracy of the Airbnb advertisement.                                                   | Integer / Float |
| -- category\_ratings\_communication | Rate the host's responsiveness to the guest's messages.                                              | Integer / Float |
| -- category\_ratings\_value         | Measures the guest's perceived value in relation to the cost of the stay.                            | Integer / Float |
| -- category\_ratings\_location      | Rates whether adequate information concerning the location of the property was supplied by the host. | Integer / Float |
| -- category\_ratings\_checkin       | Rates the ease of the check-in process for the property.                                             | Integer / Float |
| -- category\_ratings\_cleanliness   | Rates the cleanliness of the property.                                                               | Integer / Float |

For more information on Airbnb's start ratings, refer to their [Help Center](https://www.airbnb.com/help/article/1257/star-ratings).

## Booking.com Review Object

This table delineates the fields that constitute the Booking.com review data supplied by the Booking Engine.

| Body Parameter           | Details                                                                   | Data Type       |
| :----------------------- | :------------------------------------------------------------------------ | :-------------- |
| rawReview                | Object containing the review data.                                        | Object          |
| -- listingId             | The Guesty ID of the listing that hosted the reservation.                 | String          |
| -- last\_change\_timestamp | E.g. `"2022-07-14 12:31:12"`                                              | String          |
| -- reservation\_id        | External reservation ID.                                                  | Integer         |
| -- content               | Contains the content of the review.                                       | Object          |
| ---- positive            | Guest review of the positive aspects of their stay.                       | String          |
| ---- negative            | Guest review of the negative aspects of their stay.                       | String          |
| ---- headline            | Guest's short review description.                                         | String          |
| ---- language\_code       | The language the review is written in. E.g. `"en-gb"`                     | String          |
| -- review\_id             | External review ID                                                        | String          |
| -- url                   | The source of the review imported into Guesty.                            | String          |
| -- reviewer              | Summary information on the reviewer (guest).                              | Object          |
| ---- is\_genius           | Indicated whether the reviewer is a member of Airbnb's Genius program.    | Boolean         |
| ---- country\_code        | Location of the reviewer. E.g. `"gb"`.                                    | String          |
| ---- name                | Name of the reviewer.                                                     | String          |
| -- reply                 | -                                                                         | String          |
| -- created\_timestamp     | The date and time the review was published. E.g. `"2022-07-14 12:00:38"`. | String          |
| -- scoring               | Contains the ratings for the different aspects of the property.           | Object          |
| ---- staff               | Rates the service the guest received from the host.                       | Float / Integer |
| ---- comfort             | Rates the level of comfort the guest experienced at the property.         | Float / Integer |
| ---- review\_score        | The overall aggregated rating of the property by the guest.               | Float / Integer |
| ---- value               | Rates the value the guest felt they received.                             | Float / Integer |
| ---- clean               | Rate the cleanliness of the property.                                     | Float / Integer |
| ---- facilities          | Rates the facilities provided.                                            | Float / Integer |

For more information on Booking.com's review system, [click here](https://partner.booking.com/en-gb/help/guest-reviews/general/everything-you-need-know-about-guest-reviews).

## Retrieving All Reviews

This `GET` request retrieves all reviews, depending on the filters specified.

**Query Parameters**

| Parameter | Details                                                     | Data Type |
| :-------- | :---------------------------------------------------------- | :-------- |
| channelId | One of two booking channels: `airbnb2` or `bookingCom`.     | String    |
| startDate | Defines the start of a date range (YYYY-MM-DD).             | String    |
| endDate   | Defines the end of a date range (YYYY-MM-DD).               | String    |
| skip      | The number of items to skip over before returning a result. | Integer   |
| limit     | The number of items to return                               | Integer   |

**Request Example**

```curl
curl --request GET \
     --url 'https://booking.guesty.com/api/reviews?channelId=airbnb2' \
     --header 'Accept: application/json; charset=utf-8' \
     --header 'authorization: Bearer <TOKEN>'
```

**Response Example**

```json
{
  "data": [
    {
      "_id": "62d00273f3a7c7ba7e016a14",
      "externalReviewId": "test_6",
      "accountId": "5db59615f6fc3b001f8ee56f",
      "channelId": "airbnb2",
      "createdAt": "2022-07-14T11:44:02.563Z",
      "createdAtGuesty": "2022-07-14T11:45:08.137Z",
      "externalListingId": "604153909318094860",
      "externalReservationId": "HMTZ9DWB9W",
      "guestId": "62330bdc1e874f003681cf32",
      "listingId": "5f90114acc5b51002979b1e0",
      "rawReview": {
        "id": 661184254142632200,
        "reviewer_role": "guest",
        "reviewer_id": 334216375,
        "reviewee_role": "host",
        "reviewee_id": 256102206,
        "listing_id": 604153909318094800,
        "reservation_confirmation_code": "HMTZ9DWB9W",
        "hidden": false,
        "submitted": true,
        "overall_rating": 4,
        "public_review": "Good",
        "id_str": "661184254142632192",
        "reviewer_id_str": "334216375",
        "reviewee_id_str": "256102206",
        "listing_id_str": "604153909318094860",
        "expires_at": "2022-07-15T06:15:05.198Z",
        "first_completed_at": "2022-07-14T11:44:02.563Z",
        "submitted_at": "2022-07-14T11:44:55.556Z",
        "category_ratings_accuracy": 4,
        "category_ratings_communication": 4,
        "category_ratings_value": 4,
        "category_ratings_location": 4,
        "category_ratings_checkin": 4,
        "category_ratings_cleanliness": 4
      },
      "reservationId": "629208e3d5b216003488065e",
      "updatedAt": "2022-07-14T11:44:55.556Z",
      "updatedAtGuesty": "2022-07-14T11:45:08.137Z",
      "reviewReplies": []
    },
    {
      "_id": "62d00231f3a7c7ba7e016a12",
      "externalReviewId": "test_4",
      "accountId": "5db59615f6fc3b001f8ee56f",
      "channelId": "airbnb2",
      "createdAt": "2022-07-12T15:47:28.485Z",
      "createdAtGuesty": "2022-07-14T11:45:35.871Z",
      "externalListingId": "52913873",
      "externalReservationId": "HMB29XEXRR",
      "guestId": "62b29a8a2bd3090033289b03",
      "listingId": "5f858abd3152ad002d31b40c",
      "rawReview": {
        "id": 660625731429787100,
        "reviewer_role": "guest",
        "reviewer_id": 465423078,
        "reviewee_role": "host",
        "reviewee_id": 389742996,
        "listing_id": 52913873,
        "reservation_confirmation_code": "HMB29XEXRR",
        "hidden": false,
        "submitted": true,
        "overall_rating": 5,
        "public_review": "Fantastic views of the city, very nicely furnished, secure, good cooking facilities and air con, beds were very comfy - would stay again.\n\nStaircase to a double bed upstairs with private balcony, all downstairs bedroom have their own doors - one has balcony access, the other an on suite. Bathrooms are all very clean and showers are huge! An amazing wrap-around balcony with seating. \n\nFeels like it’s barely just being held together in some places so be careful. ie rusted balcony railings, dodgy wardrobe door and toilet flush, missing bed slats - but nothing that’s going to ruin your stay, the apartment was a lot of fun and the spiral stairs are indeed as good as they look!",
        "id_str": "660625731429787188",
        "reviewer_id_str": "465423078",
        "reviewee_id_str": "389742996",
        "listing_id_str": "52913873",
        "expires_at": "2022-07-14T11:45:24.102Z",
        "first_completed_at": "2022-07-12T15:47:28.485Z",
        "submitted_at": "2022-07-12T15:56:22.173Z",
        "category_ratings_cleanliness": 4,
        "category_ratings_accuracy": 5,
        "category_ratings_location": 4,
        "category_ratings_checkin": 5,
        "category_ratings_communication": 3,
        "category_ratings_value": 5
      },
      "reservationId": "62b29a8a2bd3090033289b13",
      "updatedAt": "2022-07-12T15:56:22.173Z",
      "updatedAtGuesty": "2022-07-14T11:45:35.871Z",
      "reviewReplies": []
    },
    {
      "_id": "62d00252f3a7c7ba7e016a13",
      "externalReviewId": "test_5",
      "accountId": "5db59615f6fc3b001f8ee56f",
      "channelId": "airbnb2",
      "complexId": "622736a59aa7300032e69baa",
      "createdAt": "2022-07-10T07:08:11.577Z",
      "createdAtGuesty": "2022-07-14T11:45:17.612Z",
      "externalListingId": "45476625",
      "externalReservationId": "HMWXYH8TAK",
      "guestId": "6273f7ea48c08700326799e1",
      "listingId": "5f9010ffccce44002ab01f5d",
      "rawReview": {
        "id": 660625585429962100,
        "reviewer_role": "guest",
        "reviewer_id": 85029137,
        "reviewee_role": "host",
        "reviewee_id": 244829847,
        "listing_id": 45476625,
        "reservation_confirmation_code": "HMWXYH8TAK",
        "hidden": false,
        "submitted": true,
        "overall_rating": 4,
        "public_review": "Very clean and spacious apartment, well appointed and comfortable. Having a washing machine and drying rack was very helpful. Good communication with the host. Key pick up and drop off was a bit inconvenient, but manageable.",
        "id_str": "660625585429962138",
        "reviewer_id_str": "85029137",
        "reviewee_id_str": "244829847",
        "listing_id_str": "45476625",
        "expires_at": "2022-07-14T11:45:06.698Z",
        "first_completed_at": "2022-07-10T07:08:11.577Z",
        "submitted_at": "2022-07-10T07:11:59.083Z",
        "category_ratings_location": 5,
        "category_ratings_cleanliness": 5,
        "category_ratings_accuracy": 5,
        "category_ratings_value": 5,
        "category_ratings_checkin": 5,
        "category_ratings_communication": 5
      },
      "reservationId": "62a1e8fe79605c0035590466",
      "subListingId": "6165d405fcc96b002da2a5b5",
      "updatedAt": "2022-07-10T07:11:59.083Z",
      "updatedAtGuesty": "2022-07-14T11:45:17.612Z",
      "reviewReplies": []
    }
  ],
  "limit": 100,
  "skip": 0
}
```

## Retrieving All Reviews on a Specific Listing

This `GET` request retrieves all reviews published for stays at a single listing, depending on the filters specified.

**Query Parameters**

| Parameter | Details                                                     | Data Type |
| :-------- | :---------------------------------------------------------- | :-------- |
| channelId | One of two booking channels: `airbnb2` or `bookingCom`.     | String    |
| listingId | ID of the listing.                                          | String    |
| startDate | Defines the start of a date range (YYYY-MM-DD).             | String    |
| endDate   | Defines the end of a date range (YYYY-MM-DD).               | String    |
| skip      | The number of items to skip over before returning a result. | Integer   |
| limit     | The number of items to return.                              | Integer   |

**Request Example**

```curl
curl --request GET \
     --url 'https://booking.guesty.com/api/reviews?channelId=airbnb2&listingId=5f90114acc5b51002979b1e0' \
     --header 'Accept: application/json; charset=utf-8' \
     --header 'authorization: Bearer <TOKEN>'
```

**Response Example**

```json
{
  "data": [
    {
      "_id": "62d00273f3a7c7ba7e016a14",
      "externalReviewId": "test_6",
      "accountId": "5db59615f6fc3b001f8ee56f",
      "channelId": "airbnb2",
      "createdAt": "2022-07-14T11:44:02.563Z",
      "createdAtGuesty": "2022-07-14T11:45:08.137Z",
      "externalListingId": "604153909318094860",
      "externalReservationId": "HMTZ9DWB9W",
      "guestId": "62330bdc1e874f003681cf32",
      "listingId": "5f90114acc5b51002979b1e0",
      "rawReview": {
        "id": 661184254142632200,
        "reviewer_role": "guest",
        "reviewer_id": 334216375,
        "reviewee_role": "host",
        "reviewee_id": 256102206,
        "listing_id": 604153909318094800,
        "reservation_confirmation_code": "HMTZ9DWB9W",
        "hidden": false,
        "submitted": true,
        "overall_rating": 4,
        "public_review": "Good",
        "id_str": "661184254142632192",
        "reviewer_id_str": "334216375",
        "reviewee_id_str": "256102206",
        "listing_id_str": "604153909318094860",
        "expires_at": "2022-07-15T06:15:05.198Z",
        "first_completed_at": "2022-07-14T11:44:02.563Z",
        "submitted_at": "2022-07-14T11:44:55.556Z",
        "category_ratings_accuracy": 4,
        "category_ratings_communication": 4,
        "category_ratings_value": 4,
        "category_ratings_location": 4,
        "category_ratings_checkin": 4,
        "category_ratings_cleanliness": 4
      },
      "reservationId": "629208e3d5b216003488065e",
      "updatedAt": "2022-07-14T11:44:55.556Z",
      "updatedAtGuesty": "2022-07-14T11:45:08.137Z",
      "reviewReplies": []
    }
  ],
  "limit": 100,
  "skip": 0
}
```

## Retrieving a Specific Review

This `GET` request retrieves the review published for for a specific stay.

**Query Parameters**

| Parameter             | Details                 | Data Type |
| :-------------------- | :---------------------- | :-------- |
| reservationId         | ID of the reservation.  | String    |
| externalReservationId | Channel reservation ID. | String    |
| externalReviewId      | Channel review ID.      | String    |

**Request Example (Review ID)**

```curl
curl --request GET \
     --url 'https://booking.guesty.com/api/reviews?externalReviewId=test_2' \
     --header 'Accept: application/json; charset=utf-8' \
     --header 'authorization: Bearer <TOKEN>'
```

**Response Example(Review ID)**

```json
{
  "data": [
    {
      "_id": "62d001c8f3a7c7ba7e016a0f",
      "externalReviewId": "test_2",
      "accountId": "5db59615f6fc3b001f8ee56f",
      "channelId": "bookingCom",
      "createdAt": "2022-07-14T12:00:38.000Z",
      "createdAtGuesty": "2022-07-14T11:38:27.934Z",
      "externalComplexId": "7254686",
      "externalListingId": "725468602",
      "externalReservationId": "3965817397",
      "guestId": "628e5f5c34afd40033be6e8f",
      "listingId": "5f9010ffccce44002ab01f5d",
      "rawReview": {
        "listingId": "6075ee4717dcf40032e650a0",
        "last_change_timestamp": "2022-07-14 12:31:12",
        "reservation_id": 3965817397,
        "content": {
          "positive": "Good location and generally well fitted out. Great having an en-suite for each bedroom.",
          "negative": "Property was not fully equipped for the number of guests,  as I guess due to past breakages not being replaced, there were not enough crockery or glassware. This was addressed for the second night. The fan in the top bedroom did not work, nor the iron in the boiler cupboard or the USB ports on one of the sockets in the top bedroom. This was reported but not put right during our short stay. The shower in the top floor bedroom took a good while to start to flow properly and randomly cut out though other 2 showers were fine; maybe this was due to lack of pressure as this was the highest point in the building. This may seem a bit of a list but I include it so that both the management can deal with issues and future guests are warned.",
          "headline": "Generally a good experience and a comfortable place for a short break in a great city.",
          "language_code": "en-gb"
        },
        "review_id": "EAZ_y__14JA",
        "url": "https://supply-xml.booking.com/review-api/properties/7254686/reviews/EAZ_y__14JA",
        "reviewer": {
          "is_genius": true,
          "country_code": "gb",
          "name": "Michael"
        },
        "reply": null,
        "created_timestamp": "2022-07-14 12:00:38",
        "scoring": {
          "staff": 7.5,
          "comfort": 7.5,
          "review_score": 6,
          "location": 7.5,
          "value": null,
          "clean": 7.5,
          "facilities": 5
        }
      },
      "reservationId": "628e8209cf403a0035de866d",
      "updatedAt": "2022-07-14T12:31:12.000Z",
      "updatedAtGuesty": "2022-07-14T11:40:28.133Z",
      "reviewReplies": []
    }
  ],
  "limit": 100,
  "skip": 0
}
```