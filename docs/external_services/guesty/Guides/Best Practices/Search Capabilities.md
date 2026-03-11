# Search Capabilities

How to enhance search functionality with filters.

Enhance your offering by utilizing our prebuilt query parameters to provide potential guests with a more focused search.

*Reference Docs*

[Get all listings included in the booking engine](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist)

### Available Endpoints

| Method | Endpoint    |
| :----- | :---------- |
| GET    | `/listings` |

### Key Parameters

The [developer document](https://booking-api-docs.guesty.com/reference/getapplicationlistingslist)  provides an extensive list of query parameters that can filter the search results when requesting all listings on the booking engine API instance. Focus the search on amenities, number of rooms, price range, specify the geographical search area using longitude and latitude coordinates, and more. Below are a few examples demonstrating some filtered searches.

A guide to related enumerations for specific fields can be found [here](https://booking-api-docs.guesty.com/reference/enums).

> 📘
>
> Some query parameters such as `numberOfBedroom` use the `$gte` operator logic. That is, the value entered will act as a minimum, and properties that match or exceed the minimum will be returned in the results.

### Examples

**Rooms and Location**

Potential guests generally seek only the space they need as their chosen destination. Why not make it easy for them to locate their perfect lodging?

> 📘
>
> When filtering by `city` you need to include the `country` as well.

*Request*

```curl
curl --location 'https://booking.guesty.com/api/listings?numberOfBedrooms=3&numberOfBathrooms=1&city=Reno&country=United%20States&fields=_id%20nickname%20title%20type%20bedrooms%20bathrooms%20accommodates%20amenities&limit=20' \
--header 'Accept: application/json'
```

*Response*

```json
{
    "results": [
        {
            "_id": "62e17bddae108b003b1f87d7",
            "nickname": "Lemon",
            "title": "Lemonade House",
            "type": "SINGLE",
            "bedrooms": 3,
            "bathrooms": 1,
            "accommodates": 5,
            "amenities": [
                "Pets allowed",
                "Suitable for children (2-12 years)",
                "Suitable for infants (under 2 years)",
                "Desk",
                "Air conditioning",
                "Heating",
                "Grab-rails for shower and toilet"
            ]
        },
        {
            "_id": "632a13588ccae900337c975b",
            "nickname": "Multi-Pad Party plac",
            "title": "Multi-Pad Party plac",
            "type": "MTL",
            "bedrooms": 3,
            "bathrooms": 1,
            "accommodates": 7,
            "amenities": [
                "Pets allowed",
                "Kettle"
            ]
        }
    ],
    "pagination": {
        "total": 2,
        "cursor": {
            "next": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYzMmExMzU4OGNjYWU5MDAzMzdjOTc1YiJ9fQ=="
        }
    }
}
```

**Within a Selected Price Range**

Provide your website visitors with a price range filter to narrow down their choice of listings to those within their budget.

*Request*

```curl
curl --location 'https://booking.guesty.com/api/listings?limit=20&city=Reno&country=United%20States&minPrice=50&maxPrice=100&checkIn=2023-12-22&fields=_id%20nickname%20title%20type%20bedrooms%20bathrooms%20accommodates%20amenities%20nightlyRates%20allotment&checkOut=2023-12-28' \
--header 'Accept: application/json'
```

*Response*

```json
{
    "results": [
        {
            "_id": "632a13588ccae900337c975b",
            "nickname": "Multi-Pad Party plac",
            "title": "Multi-Pad Party plac",
            "type": "MTL",
            "bedrooms": 3,
            "bathrooms": 1,
            "accommodates": 7,
            "amenities": [
                "Pets allowed",
                "Kettle"
            ],
            "nightlyRates": {
                "2023-12-22": 100,
                "2023-12-23": 100,
                "2023-12-24": 100,
                "2023-12-25": 100,
                "2023-12-26": 100,
                "2023-12-27": 100
            },
            "allotment": {
                "2023-12-22": 38,
                "2023-12-23": 38,
                "2023-12-24": 38,
                "2023-12-25": 38,
                "2023-12-26": 38,
                "2023-12-27": 38
            }
        }
    ],
    "pagination": {
        "total": 1,
        "cursor": {
            "next": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYzMmExMzU4OGNjYWU5MDAzMzdjOTc1YiJ9fQ=="
        }
    }
}
```

**Within a Specific Locale**

Sometimes, potential guests know which city they wish to visit but not the area within it. Provide them with the ability to select a radius within the area to apprise them of viable options.

*Request*

```curl
curl --location 'https://booking.guesty.com/api/listings?limit=20&fields=_id%20nickname%20title%20type%20bedrooms%20bathrooms%20accommodates%20amenities&minLng=28.2231216&maxLng=28.2231311&minLat=36.4480413&maxLat=36.4480504' \
--header 'Accept: application/json'
```

*Response*

```json
{
    "results": [
        {
            "_id": "636d12cf59619a00319c3a31",
            "nickname": "Fresh Lemon",
            "title": " Lemonade House",
            "type": "SINGLE",
            "bedrooms": 1,
            "bathrooms": 1,
            "accommodates": 5,
            "amenities": [
                "Suitable for children (2-12 years)",
                "Suitable for infants (under 2 years)",
                "Desk",
                "Air conditioning",
                "Heating",
                "Hot tub"
            ]
        }
    ],
    "pagination": {
        "total": 1,
        "cursor": {
            "next": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYzNmQxMmNmNTk2MTlhMDAzMTljM2EzMSJ9fQ=="
        }
    }
}
```

**Required Amenities**

Amenities are essential in a guest's decision to book a property. Allowing them to seek out listings with amenities they consider necessary increases the chances of making the sale.

*Request*

```curl
curl --location 'https://booking.guesty.com/api/listings?limit=20&fields=_id%20nickname%20title%20type%20bedrooms%20accommodates%20amenities%20nightlyRates%20allotment&checkIn=2023-12-22&checkOut=2023-12-28&includeAmenities=PETS_ALLOWED%2CSUITABLE_FOR_INFANTS%2CSUITABLE_FOR_CHILDREN' \
--header 'Accept: application/json'
```

*Response*

```json
{
    "results": [
        {
            "_id": "636b996fe886d20053ec3f05",
            "nickname": "J-city",
            "title": "Un lives here",
            "type": "SINGLE",
            "bedrooms": 1,
            "accommodates": 7,
            "amenities": [
                "Pets allowed",
                "Suitable for children (2-12 years)",
                "Suitable for infants (under 2 years)"
            ],
            "nightlyRates": {
                "2023-12-22": 1306,
                "2023-12-23": 1306,
                "2023-12-24": 777,
                "2023-12-25": 777,
                "2023-12-26": 777,
                "2023-12-27": 777
            },
            "allotment": {
                "2023-12-22": 1,
                "2023-12-23": 1,
                "2023-12-24": 1,
                "2023-12-25": 1,
                "2023-12-26": 1,
                "2023-12-27": 1
            }
        }
    ],
    "pagination": {
        "total": 1,
        "cursor": {
            "next": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYzNmI5OTZmZTg4NmQyMDA1M2VjM2YwNSJ9fQ=="
        }
    }
}
```