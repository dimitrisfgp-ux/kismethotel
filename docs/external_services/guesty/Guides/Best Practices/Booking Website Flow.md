# Booking Website Flow

> 📘 Contact our team
>
> If you're having trouble, contact us at [booking-engine-support@guesty.com](mailto:booking-engine-support@guesty.com) for assistance!

We will focus on three phases of users who make an online hotel reservation to create a functional direct booking website:

![](https://files.readme.io/4660976-Phases.png "Phases.png")

# *Phase 1 - Search And Evaluation*

1. **Input stay requirements** – includes optional parameters like location (city), number of guests, and proposed dates of stay

> 📘
>
> You can provide your guests an option to select a city by using [Get listings cities](https://guesty-booking.readme.io/reference#listings-cities)

2. **Compare and evaluate results** – The user may view multiple hotel/room/rate\
   combinations

You can either provide a list of properties using *[Get listings](https://guesty-booking.readme.io/reference#listings)* or provide a list of **available** properties using *[Get available listings](https://guesty-booking.readme.io/reference#available-listings)*

The endpoints will provide a list of properties together with the price of the lowest available room, a unique ID, photos, and descriptive data such as location, address, description, and amenity list.

<Image align="center" width="80%" src="https://files.readme.io/60a1bda-3.png" />

# *Phase 2 - Selection*

3. **Browse property details** - Allow your users to get a full view of the property using the data you get from Guesty.\
   Using [Get listing calendar](https://guesty-booking.readme.io/reference#listing-calendar), you can show the property calendar and availability in any given time period (up to 2 years ahead).

4. **Calculate** - present the full and final price breakdown using *[Get reservation quote](https://guesty-booking.readme.io/reference#reservation-quote)*

5. **Decide** – The user decides which hotel/room/rate combination meets their requirements

<Image align="center" src="https://files.readme.io/e2483c3-2.png" />

# *Phase 3 - Checkout*

6. **Input guest details** – such as name, address, email address, etc.

7. **Input payment details** – For users that use *instant book* collect the payment details and pass the [GuestyPay](https://booking-api-docs.guesty.com/docs/tokenizing-payment-methods) or [Stripe](https://booking-api-docs.guesty.com/docs/stripe-tokenization-flow) token via API.

8. **Confirm reservation**  - This will instantly register the reservation on the Guesty system and return a unique booking confirmation number for you to provide to your guests.

To create the booking, make a  POST request using [Create instant reservation based on quote](https://booking-api-docs.guesty.com/reference/createinstantreservationfromquote) or  [Create inquiry for reservation based on quote](https://booking-api-docs.guesty.com/reference/createinquiryreservationfromquote) with the `quoteId`, `ratePlanId`, `ccToken`, `guest`, and `policy` objects. 

> 🚧 Reservation Amendments
>
> When manipulating reservations created with BEAPI or via the Open API [reservations endpoints](https://open-api.guesty.com/v1/reservations), please allow up to 60 seconds between requests to allow each to complete and achieve the expected outcome.

The user can complete these phases over single or multiple visits.

<Image align="center" width="80%" src="https://files.readme.io/66561a0-y_hx3Mc5qPjGK6nR6FK2V_lG6baZTmZCyZ56neT22EZgEP_FRXWik2l-2erU1Apnq2cbQy0zxnkNOYXWE05e8i9b-GqRKNJDvUzO1owBgMaOqS5zNDnJh0jWdSuwSG2zT7wNHV7ewds.gif" />

## Booking Options

> ❗️ Important
>
> 1. If you have yet to create or receive direct bookings on your Guesty account. **Please make sure to activate the booking engine** by [creating a test reservation](https://help.guesty.com/hc/en-gb/articles/9358999571101-Creating-a-Manual-Reservation-via-the-Multi-Calendar) in the UI. Booking Engine API reservation requests require this activation to work.
> 2. Ensure that the value you select for [Booking options](https://help.guesty.com/hc/en-gb/articles/9366304056605-Creating-a-Booking-Engine-API-instance-Explained#excluded-listings) in your Booking Engine API Instance matches the flow you're building; otherwise, reservation creation requests will fail.

Before implementing the checkout flow on your website, please check your settings on Guesty.\
For each Booking Engine API instance in Guesty, users can choose how guests will be able to make reservations:

* **Only inquiries**: Guests can place a booking request for available dates. Once you confirm the inquiry, obtain the guest's credit card details and enter them manually. This option is helpful when taking payment on location or if you want to pre-approve existing guests without a credit card.

* **Only instant booking**: Guests can book available dates according to the availability of the listing. Once the guest's credit card is validated, the dates are booked.

* **Both**: Booking engine API can generate both instant bookings and inquiries,\
  The choice can be left up to the guest or hard-coded into the booking engine by booking with or without a credit card token

| Booking Option      | Credit card token                   | Reservation status |
| :------------------ | :---------------------------------- | :----------------- |
| Only Inquiries      | No                                  | Reserved           |
| Only Instant book   | Yes<sup style={{color:'blue'}}>\*</sup> | Confirmed          |
| Both (Inquiry)      | No                                  | Reserved           |
| Both (Instant book) | Yes<sup style={{color:'blue'}}>\*</sup> | Confirmed          |

<HTMLBlock>
  {`
  <p style={{fontSize:'11px'}} ><sup style={{color:'blue'}}>*</sup> The reservation will still be created even if the payment method is invalid.</p>
  `}
</HTMLBlock>

> 📘 Updates & Cancellations
>
> Guesty’s Booking Engine API does not support post-reservation updates or cancellations by guests. These updates can be made manually on Guesty.

## Processing Payment Models

Decide how to collect payments for your guests, depending on the booking option you chose for your Booking Engine API instance:

**GuestyPay**

You can use the Javascript SDK to easily and quickly implement the capturing and tokenization of a guest's payment method. Find out more [here](https://booking-api-docs.guesty.com/docs/tokenizing-payment-methods)/

**By Stripe through Guesty**

To charge a guest’s credit card in Guesty, you must generate a payment token in Stripe. Guesty accepts only payment tokens via our API, not credit card details. Follow [this guide](https://booking-api-docs.guesty.com/docs/stripe-tokenization-flow) to learn how.

> 🚧 Note
>
> Only create the payment method in Stripe. Guesty will create the customer or attach the payment method to an existing one when it collects a payment. Attempting that yourself will leaded to a failed payment error.

Once the Stripe token has been generated, you can either use the full response or only the token in the payment method call. [Auto Payments](https://support.guesty.com/en/article/adding-automated-payments) can also be set to automate this process.

**Using Guesty’s Guest Invoice:**

If a credit card token is not added to the reservation, you can collect the payment using Guesty’s [Guest Invoice feature.](https://help.guesty.com/hc/en-gb/articles/9369482655133-Setting-Up-Guest-Invoices)

**Record the collected fee in Guesty:**

[Collect your payment manually](https://help.guesty.com/hc/en-gb/articles/9360547841437-Collecting-a-Payment-Manually) using alternative payment methods.

> ❗️ Important
>
> The creation and confirmation of inquiries or reservations are not dependent on the validity of the payment method. They will be processed regardless of the payment method's status.

### How to Identify a Listing's Payment Processor Account

To identify the payment processor and account details for every listing, you can use the *[Get listing's payment provider endpoint](https://booking-api-docs.guesty.com/reference/getpaymentproviderbylistingid)*

## Coupon Codes

Add coupons and offer discounts, which can then be applied to all listings on the connected booking engine.\
The coupons are set up on Guesty.

If you are using the 'Reservation V1' endpoints, you can and can be validated using the *[Get reservation quote endpoint](https://booking-api-docs.guesty.com/reference/calculatereservationmoney)*

If you are using the 'Reservation quote' endpoints, the coupons are added to the quote and can be managed using the *[Update coupon in a quote endpoint](https://booking-api-docs.guesty.com/reference/managerateplanquotecoupons)* and *[Create a reservation quote](https://booking-api-docs.guesty.com/reference/createreservationquote)* and

> 🚧 Coupon Name
>
> Use numbers and letters for your coupons. Coupons containing special characters cannot be redeemed.

### Coupon Limits

The limit on a coupon's uses under "Total Uses" is based on the number of reservations that can be created with that coupon. If the limit of 10, 10 guests can use it for one reservation each, or one guest can use it for 10 separate reservations.