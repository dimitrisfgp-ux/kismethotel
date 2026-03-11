# Coupons

How to to ensure coupons are configured and implemented correctly.

To maximize the effectiveness of coupons in promoting new bookings and rewarding loyal customers, it is crucial to correctly set them up in your Guesty account based on your reservation flow configuration.

> 📘 Note
>
> If you've implemented the [Reservations V1 flow](https://booking-api-docs.guesty.com/reference/creatererservation), we strongly recommend that you replace it with our new [Reservation quote](https://booking-api-docs.guesty.com/reference/createreservationquote) flow.

### Reservations V1 Flow

Coupons are created and configured under the *Booking Engine API Instance* settings. Guesty's [Help Center](https://help.guesty.com/hc/en-gb/articles/9372144729629-Creating-Discount-Coupons-for-Your-Booking-Engine-API) provides more information and guidance.

### Reservation Quote Flow

This flow represents our latest iteration of the reservation creation process. It is designed to work seamlessly with the most up-to-date version features. Coupon settings for it are found under *Revenue Management*. Learn how to create and edit them [here](https://help.guesty.com/hc/en-gb/articles/9358203918877).

> ❗️ Important
>
> *Revenue Management* coupons won't apply to *Reservations V1*. Likewise, *Booking Engine API Instance* coupons won't apply to *Reservations V1*. Make sure to configure the correct feature, else the coupon won't be applied.