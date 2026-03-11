# Guest portal

> 📘 Contact our team
>
> If you're having trouble, contact us at [booking-engine-support@guesty.com](mailto:booking-engine-support@guesty.com) for assistance!

## Creating a Guest Portal

A guest portal is a custom page idea where you can show your guests their reservation details, information about your listing, recommended activities, local restaurants, and so on.

Creating a guest portal is a great way to build a personal relationship with your guests while also giving them visibility into the status of their reservations.

To retrieve reservation details for your Guest Portal, follow the steps below:

#### Step by step:

1. Store the `reservationId` returned from the [Create reservation](https://guesty-booking.readme.io/reference#create-reservation) endpoint.
2. Using this `reservationId`, call the [Retrieve reservation](https://booking-api-docs.guesty.com/reference/getquotereservationbyid) endpoint.

You can get all the reservation details for any specific reservation by using the [Retrieve reservation](https://booking-api-docs.guesty.com/reference/getapplicationreservation) endpoint.

Then, you can use these reservation details while designing your Guest Portal.

> 👍 Tip:
>
> You can also create a **Reservations Center** with all of your guests' current reservations using the Guesty Booking Engine API.

![](https://files.readme.io/d0ecc15-4.png "4.png")