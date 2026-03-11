Errors

# Errors

## Errors

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Error Code
      </th>

      <th style={{ textAlign: "left" }}>
        Meaning
      </th>

      <th style={{ textAlign: "left" }}>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        NOT\_FOUND
      </td>

      <td style={{ textAlign: "left" }}>
        Requested resource not found.
      </td>

      <td style={{ textAlign: "left" }}>
        The reasons of this is the requested resource doesn't exist in scope of requester account.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        FORBIDDEN
      </td>

      <td style={{ textAlign: "left" }}>
        Request do not allowed
      </td>

      <td style={{ textAlign: "left" }}>
        Do not have an access to the requested resource in scope of booking engine (f.e. coupon, listing)
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        WRONG\_REQUEST\_PARAMETERS
      </td>

      <td style={{ textAlign: "left" }}>
        Bad request
      </td>

      <td style={{ textAlign: "left" }}>
        The request parameters are invalid, do not allowed or missed
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        LISTING\_CALENDAR\_BLOCKED
      </td>

      <td style={{ textAlign: "left" }}>
        Listing calendar is blocked
      </td>

      <td style={{ textAlign: "left" }}>
        Requested for booking listing is not available for given dates.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        MIN\_NIGHT\_MISMATCH
      </td>

      <td style={{ textAlign: "left" }}>
        Reservation request didn’t  pass listing min nights restriction
      </td>

      <td style={{ textAlign: "left" }}>
        Listing minimum nights restriction value is greater then requested reservation period
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_NOT\_FOUND
      </td>

      <td style={{ textAlign: "left" }}>
        Coupon doesn’t exist
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon code doesn’t exist in requester booking engine and will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_IS\_DISABLED
      </td>

      <td style={{ textAlign: "left" }}>
        Coupon disabled
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon code disabled in requester booking engine and will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_MIN\_NIGHT\_MISMATCH
      </td>

      <td style={{ textAlign: "left" }}>
        Reservation request didn’t pass coupon min nights restriction
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon code minimum nights restriction value is greater then requested reservation period and will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_MAXIMUM\_USES\_EXCEEDED
      </td>

      <td style={{ textAlign: "left" }}>
        No uses left in requested coupon
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon no uses left and will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_EXPIRATION\_DATE\_EXCEEDED
      </td>

      <td style={{ textAlign: "left" }}>
        Coupon expired
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon expired and will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_OUT\_OF\_CHECKIN\_RANGE
      </td>

      <td style={{ textAlign: "left" }}>
        Reservation request didn’t pass coupon check in restriction
      </td>

      <td style={{ textAlign: "left" }}>
        Passed to the reservation payload coupon code cannot\
        be applied because requested reservation checkin date is out of coupon checkin restriction. The coupon will be removed from reservation payload. No discount applied.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        COUPON\_UNEXPECTED\_ERROR
      </td>

      <td style={{ textAlign: "left" }}>
        Unexpected error
      </td>

      <td style={{ textAlign: "left" }}>
        Unexpected error happened while coupon validation process was running. No discount applied.
      </td>
    </tr>
  </tbody>
</Table>

## Error JSON

The applicative validations and errors are returned with 400 (Bad Request) HTTP response code accompanied with the following error structure:

Request validation error response structure:

```json JSON
{
  "error_code":"WRONG_REQUEST_PARAMETERS",
  "message":"Request didn't pass validation",
  "data": {
  	"errors": [
    	"\"minOccupancy\" must be greater than 0",
      "\"forbiddenParameter\" is not allowed"
    ]
  }
}
```

Request error response structure:

```json
{
  "error_code":"CREATE_RESERVATION_ERROR",
  "message":"Failed to create reservation",
  "data": {
  	"errors": [
    	"LISTING_CALENDAR_BLOCKED"
    ],
    "requestId": "7a63a0ef7470520b"
  }
}
```

Any issues with unexpected API response which have **requestId** and raised to the Guesty support team should have attached **requestId**