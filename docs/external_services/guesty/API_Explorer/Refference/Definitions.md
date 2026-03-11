Definitions

# Definitions

# Property resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Property Name
      </th>

      <th style={{ textAlign: "left" }}>
        Type
      </th>

      <th style={{ textAlign: "left" }}>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        * id
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Unique property ID from Guesty
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        title
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Listing title as configured in Guesty
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        nickname
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Listing nickname as configured in Guesty
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        type
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        ListingTypes -\
        SINGLE - Top unit\
        MTL - Multi unit (contain one or more allotment per unit)
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        accomodates
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Maximum occupancy of the listing
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        accountId
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        The Guesty account ID that relate to the property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        accountTaxes
      </td>

      <td style={{ textAlign: "left" }}>
        [Taxes object](https://guesty-booking.readme.io/docs/property-details#accounttaxes-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        address
      </td>

      <td style={{ textAlign: "left" }}>
        [address object](https://booking-api-docs.guesty.com/reference/definitions#propertyaddress-resource-definition)
      </td>

      <td style={{ textAlign: "left" }}>
        Property address details.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        amenities
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        List of all the property amenities\
        [Enum](https://booking-api-docs.guesty.com/reference/enums#amenities-type-enum)
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        bathrooms
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of bathrooms in the property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        bedrooms
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of bedrooms in the property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        beds
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of beds in the property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        bedType
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        calendarRules
      </td>

      <td style={{ textAlign: "left" }}>
        [Calendar Rules object](https://booking-api-docs.guesty.com/reference/definitions#calendarrules-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        defaultCheckInTime
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        The default check-in time for this property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        defaultCheckOutTime
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        The default check-out time for this property
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        pictures
      </td>

      <td style={{ textAlign: "left" }}>
        [Pictures object](https://booking-api-docs.guesty.com/reference/definitions#pictures-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        prices
      </td>

      <td style={{ textAlign: "left" }}>
        [Prices object](https://booking-api-docs.guesty.com/reference/definitions#prices-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        propertyType
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Define the property type [enum](https://booking-api-docs.guesty.com/reference/enums#property-type-enum)
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        RoomType
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        \#Property resource definition

        \[block:parame
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        publicDescription
      </td>

      <td style={{ textAlign: "left" }}>
        [Public Description object](https://booking-api-docs.guesty.com/reference/definitions#publicdescription-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        tags
      </td>

      <td style={{ textAlign: "left" }}>
        \#Propert
      </td>

      <td style={{ textAlign: "left" }}>
        Array of listing Guesty custom tags
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        taxes
      </td>

      <td style={{ textAlign: "left" }}>
        [Taxes object](https://booking-api-docs.guesty.com/reference/definitions#taxes-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        timezone
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        terms
      </td>

      <td style={{ textAlign: "left" }}>
        [Terms object](https://booking-api-docs.guesty.com/reference/definitions#terms-resource-definition)
      </td>

      <td style={{ textAlign: "left" }} />
    </tr>
  </tbody>
</Table>

# accountTaxes resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        * id
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        amount
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>

    <tr>
      <td>
        appliedOnFees
      </td>

      <td>
        \#Propert
      </td>

      <td />
    </tr>

    <tr>
      <td>
        name
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        quantifier
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        type
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        units
      </td>

      <td>
        String
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# calendarRules resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        defaultAvailability
      </td>

      <td>
        Enum
      </td>

      <td>
        AVAILABLE/BLOCKED
      </td>
    </tr>

    <tr>
      <td>
        seasonalMinNights
      </td>

      <td>
        \#Property resourc
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---from
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---to
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        rentalPeriods
      </td>

      <td>
        \#Property resou
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---from
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---to
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        advanceNotice
      </td>

      <td>
        \#Property resou
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---defaultSettings
      </td>

      <td>
        Object
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \------hours
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \------allowRequestToBook
      </td>

      <td>
        Boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        bookingWindow
      </td>

      <td>
        \#Property resou
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \---defaultSettings
      </td>

      <td>
        Object
      </td>

      <td />
    </tr>

    <tr>
      <td>
        \------days
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# Get calendar resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        date
      </td>

      <td>
        String (date)
      </td>

      <td>
        Format: yyyy-mm-dd
      </td>
    </tr>

    <tr>
      <td>
        minNights
      </td>

      <td>
        Number
      </td>

      <td>
        minimum nights value for the listing
      </td>
    </tr>

    <tr>
      <td>
        isBaseMinNights
      </td>

      <td>
        Boolean
      </td>

      <td>
        Whether this is the listing's minimum nights, or was specifically set for this day
      </td>
    </tr>

    <tr>
      <td>
        status
      </td>

      <td>
        String (Enum)
      </td>

      <td>
        available, unavailable, reserved, booked
      </td>
    </tr>

    <tr>
      <td>
        cta
      </td>

      <td>
        Boolean
      </td>

      <td>
        Closed To Arrival - Whether reservations are prevented from being booked starting on this day
      </td>
    </tr>

    <tr>
      <td>
        ctd
      </td>

      <td>
        Boolean
      </td>

      <td>
        Closed To Departure - Whether reservations are allowed to be booked ending on this day
      </td>
    </tr>
  </tbody>
</Table>

# propertyAddress resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        city
      </td>

      <td>
        String
      </td>

      <td>
        City in which the property is located
      </td>
    </tr>

    <tr>
      <td>
        country
      </td>

      <td>
        String
      </td>

      <td>
        the country where the property is located.
      </td>
    </tr>

    <tr>
      <td>
        full
      </td>

      <td>
        String
      </td>

      <td>
        Full address
      </td>
    </tr>

    <tr>
      <td>
        lat
      </td>

      <td>
        Number
      </td>

      <td>
        Latitude of the property location
      </td>
    </tr>

    <tr>
      <td>
        lng
      </td>

      <td>
        Number
      </td>

      <td>
        Longitude of the property location
      </td>
    </tr>

    <tr>
      <td>
        state
      </td>

      <td>
        String
      </td>

      <td>
        Optional. State/Province.
      </td>
    </tr>

    <tr>
      <td>
        street
      </td>

      <td>
        String
      </td>

      <td>
        Street in which the property is located
      </td>
    </tr>

    <tr>
      <td>
        neighborhood
      </td>

      <td>
        String
      </td>

      <td>
        Neighborhood in which the property is located as defined on Guesty
      </td>
    </tr>
  </tbody>
</Table>

# pictures resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        original
      </td>

      <td>
        String
      </td>

      <td>
        URL to origin size image
      </td>
    </tr>

    <tr>
      <td>
        large
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        regular
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        thumbnail
      </td>

      <td>
        String
      </td>

      <td>
        URL to picture thumbnail
      </td>
    </tr>

    <tr>
      <td>
        * id
      </td>

      <td>
        String
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# prices resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        basePrice
      </td>

      <td>
        Integer
      </td>

      <td>
        Regular listing price without custom override applied
      </td>
    </tr>

    <tr>
      <td>
        currency
      </td>

      <td>
        String
      </td>

      <td>
        [currencies](https://booking-api-docs.guesty.com/reference/enums#currency-code-enum)
      </td>
    </tr>

    <tr>
      <td>
        monthlyPriceFactor
      </td>

      <td>
        Number
      </td>

      <td>
        Listing price with monthly override applied
      </td>
    </tr>

    <tr>
      <td>
        weeklyPriceFactor
      </td>

      <td>
        Number
      </td>

      <td>
        Listing price with weekly override applied
      </td>
    </tr>

    <tr>
      <td>
        extraPersonFee
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>

    <tr>
      <td>
        cleaningFee
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>

    <tr>
      <td>
        petFee
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# publicDescription resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Guest controls
      </td>

      <td>
        [guestControls object](https://guesty-booking.readme.io/docs/property-details#GuestControls-resource-definition)
      </td>

      <td />
    </tr>

    <tr>
      <td>
        space
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        access
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        neighborhood
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        transit
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        notes
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        interactionWithGuests
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        summary
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>

    <tr>
      <td>
        houseRules
      </td>

      <td>
        String
      </td>

      <td>
        Property description as provided by the user in Guesty
      </td>
    </tr>
  </tbody>
</Table>

# GuestControls resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        allowsChildren
      </td>

      <td>
        boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        allowsInfants
      </td>

      <td>
        boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        allowsPets
      </td>

      <td>
        boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        allowsSmoking
      </td>

      <td>
        boolean
      </td>

      <td />
    </tr>

    <tr>
      <td>
        allowsEvents
      </td>

      <td>
        boolean
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# taxes resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        * id
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        amount
      </td>

      <td>
        Number
      </td>

      <td />
    </tr>

    <tr>
      <td>
        appliedOnFees
      </td>

      <td>
        \#Propert
      </td>

      <td />
    </tr>

    <tr>
      <td>
        name
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        quantifier
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        type
      </td>

      <td>
        String
      </td>

      <td />
    </tr>

    <tr>
      <td>
        units
      </td>

      <td>
        String
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# terms resource definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        minNight
      </td>

      <td>
        integer
      </td>

      <td>
        The minimum reservation nights if reservation check in is on this day
      </td>
    </tr>

    <tr>
      <td>
        maxNights
      </td>

      <td>
        integer
      </td>

      <td>
        The maximum reservation nights if reservation check in is on this day
      </td>
    </tr>

    <tr>
      <td>
        cancellation
      </td>

      <td>
        string
      </td>

      <td />
    </tr>
  </tbody>
</Table>

# Create Reservation Response Definition

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Name
      </th>

      <th>
        Type
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        * id
      </td>

      <td>
        String
      </td>

      <td>
        Id of the created object which is either a Reservation or Inquiry
      </td>
    </tr>

    <tr>
      <td>
        status
      </td>

      <td>
        String
      </td>

      <td>
        Status of the booking.

        confirmed: Successfully created a Reservation.\
        inquiry: Successfully created a Inquiry.\
        declined: Failed to create a Inquiry or Reservation.
      </td>
    </tr>

    <tr>
      <td>
        confirmationCode
      </td>

      <td>
        String
      </td>

      <td>
        Confirmation code for the reservation. This is null for an inquiry or declined status.
      </td>
    </tr>

    <tr>
      <td>
        errors
      </td>

      <td>
        String
      </td>

      <td>
        Error string describing why the request was declined
      </td>
    </tr>
  </tbody>
</Table>