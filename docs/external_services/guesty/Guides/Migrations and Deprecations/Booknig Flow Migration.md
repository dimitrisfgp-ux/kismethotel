# Booking Flow Migration

How to move from the old booking flow resources to the newer ones.

## Overview

This guide shows you how to migrate your booking flow from the old reservations v1 and listing resources to the current <Anchor label="Reservation Quote Flow" target="_blank" href="doc:new-reservation-creation-flow">Reservation Quote Flow</Anchor> infrastructure. The key changes are:

* **Removal of the Reservations V1 endpoints**
* **Removal of the dedicated listing availability endpoint**:
  * The [Get all the listings included in the booking engine](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist) endpoint has `checkIn` and `checkOut` date path parameters that define the listings request as an availability one.

<br />

## Endpoint resource replacements

<br />

<HTMLBlock>
  {`
  <table>
  <thead>
  <tr>
  <th>
  <p>Deprecated Resource</p>
  </th>
  <th>
  <p>Replacement Resource(s)</p>
  </th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/creatererservation" target="_blank" rel="noopener">/api/reservations</a></li>
  </ul>
  </td>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/createreservationquote" target="_blank" rel="noopener">/api/reservations/quotes</a></li>
  <li><a href="https://booking-api-docs.guesty.com/reference/createinstantreservationfromquote" target="_blank" rel="noopener">/api/reservations/quotes/{quoteId}/instant</a></li>
  <li><a href="https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote" target="_blank" rel="noopener">/api/reservations/quotes/{quoteId}/inquiry</a></li>
  </ul>
  </td>
  </tr>
  <tr>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/calculatereservationmoney" target="_blank" rel="noopener">/api/reservations/money</a></li>
  </ul>
  </td>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/createreservationquote" target="_blank" rel="noopener">/api/reservations/quotes</a></li>
  </ul>
  </td>
  </tr>
  <tr>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/getapplicationreservation" target="_blank" rel="noopener">/api/reservations/{reservationId}</a></li>
  </ul>
  </td>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/getquotereservationbyid" target="_blank" rel="noopener">/api/reservations/{reservationId}/details</a></li>
  </ul>
  </td>
  </tr>
  <tr>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/getavailablelistings" target="_blank" rel="noopener">/api/listings/availability</a></li>
  </ul>
  </td>
  <td>
  <ul>
  <li><a href="https://booking-api-docs.guesty.com/reference/getapplicationlistingslist" target="_blank" rel="noopener">/api/listings</a></li>
  </ul>
  </td>
  </tr>
  </tbody>
  </table>
  `}
</HTMLBlock>

<br />

## Migration checklist

1. Update paths
2. Adjust response parsing
3. Adjust rate limit management accordingly

<br />

## Deprecation Schedule

Please review the following schedule for the final removal of these old resources:

<br />

| Event                                | Date             | Details                                                                                                                                                    |
| :----------------------------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final end-of-life (EoL) announcement | 25 November 2025 | Email notification sent. You should begin planning your migration.                                                                                         |
| Start of Sunset Period               | 15 January 2026  | The old resources will be removed from the documentation, but will remain functional until the deadline.                                                   |
| Hard deprecation date                | 31 March 2026    | After this date, the old resources will be permanently removed, and all associated API calls will fail. **Immediate action is required before this date**. |

<br />