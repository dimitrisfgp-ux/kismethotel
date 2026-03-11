# Property Descriptions

How to retrieve space arrangements, house rules marketing descriptions.

## Overview

Writing appealing and informative descriptions is essential to attract guests and enhance their satisfaction. As countless listings are advertised on the internet, hosts must create descriptions highlighting their property's unique features to distinguish it from others. The description is set through the [Listings API](https://open-api-docs.guesty.com/reference/put_listings-id), and several different parameters define it:

* The name and summary
* The description of the space and the neighborhood
* Information about transit and how to get to the listing
* The house rules
* Bed arrangements

This document explains how to locate and retrieve these descriptions through the Booking Engine API for use with your custom integration, be it a website or app.

*Reference Docs*

[Get all listings included in the booking engine](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist)\
[Get a specific listing](https://booking-api-docs.guesty.com/reference/getapplicationlisting)

**Available Endpoints**

| Method | Endpoint                |
| :----- | :---------------------- |
| GET    | `/listings`             |
| GET    | `/listings/{listingId}` |

## Bed Arrangements

Sleeping arrangements can be configured using our [Spaces API](https://open-api-docs.guesty.com/reference/post_properties-spaces-unit-type-unittypeid-add). Once set up, this information will be available in the listing object response.

**Key Parameters**

| Parameter                    | Description                                         | Data Type |
| :--------------------------- | :-------------------------------------------------- | :-------- |
| `bedArrangements`            | Object containing the listing's space arrangements. | object    |
| -- `unitType`                | The listing ID.                                     | string    |
| -- `accountId`               | Guesty account ID                                   | string    |
| -- `bedrooms`                | An array of space-arrangement objects               | \[object]  |
| --- `roomNumber`             | The number of the room.                             | integer   |
| --- `name`                   | Title of the space. E.g., "Bedroom 1".              | string    |
| --- `type`                   | Type of room. E.g., bedroom / shared space.         | string    |
| --- `beds`                   | The quantity and type of bed(s).                    | object    |
| --`bedroomsAllowed`          | Can be ignored. For internal use only.              | boolean   |
| -- `isDefaultBedArrangement` | Can be ignored. For internal use only.              | boolean   |
| -- `bathrooms`               | \*\*(Coming soon)\*\*                               | object    |
| --- `BEDROOM`                | \*\*Ensuite / attached to the bedroom.\*\*          | integer   |
| --- `PRIVATE`                | \*\*Separate private bathroom.\*\*                  | integer   |
| -- `deleted`                 | For internal use only.                              | boolean   |
| --  `deletedAt`              | ISO date time stamp. Internal use only.             | date      |

#### Examples

**Get All listings Request**

```curl
curl --location 'https://booking.guesty.com/api/listings?fields=title%20nickname%20type%20address%20title%20accommodates%20bedArrangements&limit=2' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {accessToken}' 
```

*Response*

```json
{
    "results": [
        {
            "title": "Lemonade House",
            "nickname": "Lemon",
            "type": "SINGLE",
            "address": {
                "full": "2100 Basecamp Way, Reno, NV 89502, USA",
                "lng": -119.89831,
                "lat": 39.625452,
                "street": "8085 Silver Lake Rd",
                "city": "Reno",
                "country": "United States",
                "zipcode": "89606",
                "state": "Nevada"
            },
            "accommodates": 5,
            "bedArrangements": {
                "_id": "62e17bddae108b003b1f87d7",
                "accountId": "62a8a2be2e53190032102a6e",
                "bedrooms": [
                    {
                        "beds": {
                            "KING_BED": 1,
                            "QUEEN_BED": 0,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "63720d719362330057cdc475",
                        "roomNumber": 0,
                        "name": "Bedroom 1",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 1,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7b8086629400388db680",
                        "roomNumber": 1,
                        "name": "Bedroom 2",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 0,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 2,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7b8086629400388db681",
                        "roomNumber": 2,
                        "name": "Bedroom 3",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 0,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 1,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7b8086629400388db682",
                        "roomNumber": 3,
                        "name": "Living Room",
                        "type": "SHARED_SPACE"
                    }
                ],
                "bedroomsAllowed": true,
                "deleted": false,
                "isDefaultBedArrangement": true,
                "unitTypeId": "62e17bddae108b003b1f87d7"
            }
        },
        {
            "title": "Multi-Pad Party plac",
            "nickname": "Multi-Pad Party plac",
            "type": "MTL",
            "address": {
                "full": "1001 E 9th St, Reno, NV 89512, USA",
                "lng": -119.8024021,
                "lat": 39.5387897,
                "street": "East 9th Street 1001",
                "city": "Reno",
                "country": "United States",
                "zipcode": "89512",
                "state": "Nevada"
            },
            "accommodates": 7,
            "bedArrangements": {
                "_id": "632a13588ccae900337c975b",
                "accountId": "62a8a2be2e53190032102a6e",
                "bedrooms": [
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 1,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "6393a50a92cb73004bf4b65a",
                        "roomNumber": 0,
                        "name": "Bedroom 1",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 1,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7bd37de009008a21b296",
                        "roomNumber": 1,
                        "name": "Bedroom 2",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 0,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 2,
                            "SOFA_BED": 0,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7bd37de009008a21b297",
                        "roomNumber": 2,
                        "name": "Bedroom 3",
                        "type": "BEDROOM"
                    },
                    {
                        "beds": {
                            "KING_BED": 0,
                            "QUEEN_BED": 0,
                            "DOUBLE_BED": 0,
                            "SINGLE_BED": 0,
                            "SOFA_BED": 1,
                            "AIR_MATTRESS": 0,
                            "BUNK_BED": 0,
                            "FLOOR_MATTRESS": 0,
                            "WATER_BED": 0,
                            "TODDLER_BED": 0,
                            "CRIB": 0
                        },
                        "_id": "644f7bd37de009008a21b298",
                        "roomNumber": 3,
                        "name": "Living Room",
                        "type": "SHARED_SPACE"
                    }
                ],
                "bedroomsAllowed": true,
                "deleted": false,
                "isDefaultBedArrangement": true,
                "unitTypeId": "632a13588ccae900337c975b"
            }
        }
    ],
    "pagination": {
        "total": 6,
        "cursor": {
            "next": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYzMmExMzU4OGNjYWU5MDAzMzdjOTc1YiJ9fQ=="
        }
    }
}
```

**Get a Specific Listing Request**

```curl
curl --location 'https://booking.guesty.com/api/listings/62e17bddae108b003b1f87d7?fields=_id%2520title%2520nickname%2520type%2520address.city%2520title%2520accommodates%2520bedArrangements' \
--header 'Authorization: Bearer {accessToken}' 
```

*Response*

```json
{
    "_id": "62e17bddae108b003b1f87d7",
    "title": "Lemonade House",
    "nickname": "Lemon",
    "type": "SINGLE",
    "address": {
        "city": "Reno"
    },
    "accommodates": 5,
    "bedArrangements": {
        "_id": "62e17bddae108b003b1f87d7",
        "accountId": "62a8a2be2e53190032102a6e",
        "bedrooms": [
            {
                "beds": {
                    "KING_BED": 1,
                    "QUEEN_BED": 0,
                    "DOUBLE_BED": 0,
                    "SINGLE_BED": 0,
                    "SOFA_BED": 0,
                    "AIR_MATTRESS": 0,
                    "BUNK_BED": 0,
                    "FLOOR_MATTRESS": 0,
                    "WATER_BED": 0,
                    "TODDLER_BED": 0,
                    "CRIB": 0
                },
                "_id": "63720d719362330057cdc475",
                "roomNumber": 0,
                "name": "Bedroom 1",
                "type": "BEDROOM"
            },
            {
                "beds": {
                    "KING_BED": 0,
                    "QUEEN_BED": 1,
                    "DOUBLE_BED": 0,
                    "SINGLE_BED": 0,
                    "SOFA_BED": 0,
                    "AIR_MATTRESS": 0,
                    "BUNK_BED": 0,
                    "FLOOR_MATTRESS": 0,
                    "WATER_BED": 0,
                    "TODDLER_BED": 0,
                    "CRIB": 0
                },
                "_id": "644f7b8086629400388db680",
                "roomNumber": 1,
                "name": "Bedroom 2",
                "type": "BEDROOM"
            },
            {
                "beds": {
                    "KING_BED": 0,
                    "QUEEN_BED": 0,
                    "DOUBLE_BED": 0,
                    "SINGLE_BED": 2,
                    "SOFA_BED": 0,
                    "AIR_MATTRESS": 0,
                    "BUNK_BED": 0,
                    "FLOOR_MATTRESS": 0,
                    "WATER_BED": 0,
                    "TODDLER_BED": 0,
                    "CRIB": 0
                },
                "_id": "644f7b8086629400388db681",
                "roomNumber": 2,
                "name": "Bedroom 3",
                "type": "BEDROOM"
            },
            {
                "beds": {
                    "KING_BED": 0,
                    "QUEEN_BED": 0,
                    "DOUBLE_BED": 0,
                    "SINGLE_BED": 0,
                    "SOFA_BED": 1,
                    "AIR_MATTRESS": 0,
                    "BUNK_BED": 0,
                    "FLOOR_MATTRESS": 0,
                    "WATER_BED": 0,
                    "TODDLER_BED": 0,
                    "CRIB": 0
                },
                "_id": "644f7b8086629400388db682",
                "roomNumber": 3,
                "name": "Living Room",
                "type": "SHARED_SPACE"
            }
        ],
        "bedroomsAllowed": true,
        "deleted": false,
        "isDefaultBedArrangement": true,
        "unitTypeId": "62e17bddae108b003b1f87d7"
    }
}
```

### Determining Totals

While the fields: `bathrooms`, `bedrooms`, and `beds`, display the sum value for these amenities, we recommend an alternative approach. The `bedArrangements` object can be considered the source for the number of bedrooms, bathrooms, beds, and bed types. Use it as a reference for performing your count of bedrooms, bathrooms, number of beds, and the number of each bed type.

**Example**

Using the single listing response from above, we can see that the `bedrooms` array contains four objects.

![](https://files.readme.io/8e8ace3-image.png)

The room type can be identified in the `type` field of the `beds` object.

![](https://files.readme.io/7057942-image.png)

> 📘
>
> The `roomNumber` count starts at zero being the first room configured in the space.

Finally, the type and quantity of beds can be lifted from the `beds` of the `bedrooms` array.

![](https://files.readme.io/1872513-image.png)

You would then arrive at the following sums:

| Type     | Quantity |
| :------- | :------: |
| King     |     1    |
| Queen    |     1    |
| Single   |     2    |
| Sofa bed |     1    |

## Public Descriptions and House Rules

Listing descriptions and house rules are contained within the same object

### Marketing Descriptions

Retain centralized management and avoid duplications of efforts and conflicting information by synchronizing the marketing descriptions on your custom website or application with the text saved in Guesty.

**Key Parameters**

| Parameter               | Description                                                                                                                                                                         | Data Type |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| `summary`               | Should cover the significant features of the space and neighborhood in 500 characters or less.                                                                                      | string    |
| `space`                 | What makes it unique, and how many people does it comfortably fit.                                                                                                                  | string    |
| `access`                | Information about what parts of the space the guests will be able to access.                                                                                                        | string    |
| `interactionWithGuests` | How much the Host will interact with the guests, and if the Host will be present during the guest stay.                                                                             | string    |
| `neighborhood`          | Information about the neighborhood and surrounding region. Suggestions about what guests should experience & do.                                                                    | string    |
| `transit`               | Information on getting to the property. Is there convenient public transit? Is parking included with the listing or nearby? How does the guest get to the listing from the airport? | string    |
| `notes`                 | Any additional details for the guest to know                                                                                                                                        | string    |

### House Rules

A listing's house rules are instructions for guests on how to behave. They should include whether children and pets are allowed and if there are rules about smoking and noise.

**Key Parameters**

| Parameter                  | Description                                                                                                                                                          | Data Type |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| `unitTypeHouseRules`       | The object containing the house rules.                                                                                                                               | object    |
| -- `unitTypeId`            | The listing ID.                                                                                                                                                      | string    |
| -- `houseRules`            |                                                                                                                                                                      | object    |
| --- `additionalRules`      | Instructions (*Additional house rules* in the UI) for guests on how to behave. It should also include whether pets are allowed and if there are rules about smoking. | string    |
| --- `petsAllowed`          |                                                                                                                                                                      | object    |
| ---- `enabled`             | Are pets allowed?                                                                                                                                                    | boolean   |
| ---- `chargeType`          | Stay for free or charge a fee.                                                                                                                                       | string    |
| --- `quietBetween`         |                                                                                                                                                                      | object    |
| ---- `enabled`             | Are quiet hours enforced?                                                                                                                                            | boolean   |
| ---- `hours`               |                                                                                                                                                                      | object    |
| ----- `start`              | Hour and time the quiet hours start in ISO date format.                                                                                                              | date      |
| ----- `end`                | Hour and time the quiet hours start in ISO date format.                                                                                                              | date      |
| --- `smokingAllowed`       |                                                                                                                                                                      | object    |
| ---- `enabled`             | Do you permit smoking at the property?                                                                                                                               | boolean   |
| --- `suitableForEvents`    |                                                                                                                                                                      | object    |
| ---- `enabled`             | Are parties or events allowed?                                                                                                                                       | boolean   |
| --- `childrenRules`        |                                                                                                                                                                      | object    |
| ---- `suitableForChildren` | Is the listing suitable for children (2-12 years)?                                                                                                                   | boolean   |
| ---- `suitableForInfants`  | Is the listing suitable for infants (under 2 years)?                                                                                                                 | boolean   |
| ---- `reason`              | Why isn't it suitable for infants?                                                                                                                                   | boolean   |
| -- `allowsSmoking`         | Is smoking allowed?                                                                                                                                                  | boolean   |
| -- `allowsEvents`          | Are parties or events allowed?                                                                                                                                       | boolean   |
| `houseRules`               | Instructions (*Additional house rules* in the UI) for guests on how to behave. It should also include whether pets are allowed and if there are rules about smoking. | string    |

**Example**

*Request*

```curl
curl --location 'https://booking.guesty.com/api/listings/62e17bddae108b003b1f87d7?fields=_id%2520title%2520nickname%2520type%2520address.city%2520title%2520accommodates%2520unitTypeHouseRules' \
--header 'Authorization: Bearer {accessToken}'
```

*Response*

```json
{
    "_id": "62e17bddae108b003b1f87d7",
    "title": "Lemonade House",
    "nickname": "Lemon",
    "type": "SINGLE",
    "address": {
        "city": "Reno"
    },
    "accommodates": 5,
    "unitTypeHouseRules": {
        "_id": "6317c7a024729e00347bcd17",
        "deleted": false,
        "houseRules": {
            "additionalRules": "50% of payment is charged at the time of the booking with the rest taken at check-in.",
            "petsAllowed": {
                "enabled": true,
                "chargeType": "petStayCharge"
            },
            "quietBetween": {
                "enabled": true,
                "hours": {
                    "start": "20:00",
                    "end": "7:00"
                }
            },
            "smokingAllowed": {
                "enabled": false
            },
            "suitableForEvents": {
                "enabled": false
            },
            "childrenRules": {
                "suitableForChildren": true,
                "suitableForInfants": true,
                "reason": "No suitable amenities and cleaning solutions used may be harmful to infants."
            }
        },
        "unitTypeId": "62e17bddae108b003b1f87d7"
    }
}
```