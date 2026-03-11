Get all the listings included in the booking engine

# Get all the listings included in the booking engine

This call returns the list of listings connected to the requester Booking Engine API instance in Guesty and filtered by given parameters

# OpenAPI definition

```json
{
  "openapi": "3.0.0",
  "info": {
    "description": "Booking Engine API",
    "version": "1.0",
    "title": "Booking Engine API"
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "paths": {
    "/api/listings": {
      "get": {
        "tags": [
          "Listings"
        ],
        "summary": "Get all the listings included in the booking engine",
        "description": "This call returns the list of listings connected to the requester Booking Engine API instance in Guesty and filtered by given parameters",
        "operationId": "getApplicationListingsList",
        "parameters": [
          {
            "in": "query",
            "name": "minOccupancy",
            "required": false,
            "description": "The minimum value of listing occupancy",
            "example": 1,
            "schema": {
              "type": "integer"
            }
          },
          {
            "in": "query",
            "name": "numberOfBedrooms",
            "required": false,
            "description": "The minimum amount of listing bedrooms",
            "example": 1,
            "schema": {
              "type": "integer",
              "default": 0
            }
          },
          {
            "in": "query",
            "name": "numberOfBathrooms",
            "required": false,
            "description": "The minimum amount of listing bathrooms",
            "example": 1,
            "schema": {
              "type": "integer",
              "default": 0
            }
          },
          {
            "in": "query",
            "name": "propertyType",
            "required": false,
            "description": "The listing property type.",
            "example": "APARTMENT",
            "schema": {
              "type": "string",
              "enum": [
                "APARTMENT",
                "HOUSE",
                "LOFT",
                "BOAT",
                "CAMPER_RV",
                "CONDOMINIUM",
                "CHALET",
                "BED_Breakfast",
                "VILLA",
                "TENT",
                "OTHER",
                "CABIN",
                "TOWNHOUSE",
                "BUNGALOW",
                "HUT",
                "DORM",
                "PARKING_SPACE",
                "PLANE",
                "TREEHOUSE",
                "YURT",
                "TIPI",
                "IGLOO",
                "EARTH_HOUSE",
                "ISLAND",
                "CAVE",
                "CASTLE",
                "STUDIO"
              ]
            }
          },
          {
            "in": "query",
            "name": "listingType",
            "required": false,
            "description": "The listing type.",
            "example": "SINGLE",
            "schema": {
              "type": "string",
              "enum": [
                "SINGLE",
                "MTL"
              ]
            }
          },
          {
            "in": "query",
            "name": "roomType",
            "required": false,
            "description": "The listing room type. All values of roomType are defined in RoomTypesQueryParameter definition",
            "example": "PRIVATE_ROOM",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "minPrice",
            "required": false,
            "description": "Minimum value of listing price. If it provided, the response will have listings which price is great or equal. Should be passed with currency query parameter",
            "example": 10,
            "schema": {
              "type": "number",
              "minimum": 0
            }
          },
          {
            "in": "query",
            "name": "maxPrice",
            "required": false,
            "description": "Maximum value of listing price. If it provided, the response will have listings which price is less or equal. Should be passed with currency query parameter",
            "example": 10,
            "schema": {
              "type": "number",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "currency",
            "required": false,
            "description": "Listing price currency. Should be provided with minPrice query parameter",
            "example": "EUR",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "includeAmenities",
            "required": false,
            "description": "Listing amenities separated by coma which should have listings. All values of amenities query parameters are defined in AmenitiesQueryParameter definition.",
            "example": "PETS_ALLOWED,SMOKING_ALLOWED,SUITABLE_FOR_INFANTS,SUITABLE_FOR_CHILDREN",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "excludeAmenities",
            "required": false,
            "description": "Listing amenities separated by coma which should not have listings. All values of amenities query parameters are defined in AmenitiesQueryParameter definition.",
            "example": "SMOKING_ALLOWED",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "minLng",
            "in": "query",
            "description": "Minimum longitude",
            "required": false,
            "example": 24.052472,
            "schema": {
              "type": "number",
              "minimum": -180,
              "maximum": 180
            }
          },
          {
            "name": "maxLng",
            "in": "query",
            "description": "Maximum longitude",
            "required": false,
            "example": 24.05687,
            "schema": {
              "type": "number",
              "minimum": -180,
              "maximum": 180
            }
          },
          {
            "name": "minLat",
            "in": "query",
            "description": "Minimum latitude",
            "required": false,
            "example": 49.830034,
            "schema": {
              "type": "number",
              "minimum": -90,
              "maximum": 90
            }
          },
          {
            "name": "maxLat",
            "in": "query",
            "description": "Maximum latitude",
            "required": false,
            "example": 49.8366506,
            "schema": {
              "type": "number",
              "minimum": -90,
              "maximum": 90
            }
          },
          {
            "in": "query",
            "name": "city",
            "required": false,
            "description": "City name from the listings address",
            "example": "Houston",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "country",
            "required": false,
            "description": "Country name from the listings address",
            "example": "United States",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "state",
            "required": false,
            "description": "State name from the listings address",
            "example": "Texas",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "neighborhood",
            "required": false,
            "description": "neighborhood from the listings address",
            "example": "Harrisburg",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "fields",
            "required": false,
            "description": "The list of the listing fields to return separated by spaces. The fields should be taken from Listing object definition. To include bed arrangements to a response, please add bedArrangements to the fields in query params.",
            "example": "_id address.city title accommodates reviews",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "checkIn",
            "required": false,
            "description": "checkin day in format YYYY-MM-DD",
            "example": "2021-12-20",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "checkOut",
            "required": false,
            "description": "checkout day in format YYYY-MM-DD",
            "example": "2021-12-25",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "limit",
            "required": false,
            "description": "Limit the number of results within a subset. Default value is 20, max value is 100",
            "example": 15,
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          },
          {
            "in": "query",
            "name": "tags",
            "description": "Limit results to listings with specific tag, can be used multiple times for and function",
            "required": false,
            "example": "tags=kinesu&tags=ExtendedStay",
            "explode": true,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "in": "query",
            "name": "kingBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "queenBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "doubleBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "singleBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "sofaBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "airMattress",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "bunkBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "floorMattress",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "waterBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "toddlerBed",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "crib",
            "required": false,
            "description": "one of bed types",
            "example": 2,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "in": "query",
            "name": "petsAllowed",
            "description": "Limit results to listings' unit type house rules",
            "required": false,
            "example": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "in": "query",
            "name": "smokingAllowed",
            "description": "Limit results to listings' unit type house rules",
            "required": false,
            "example": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "in": "query",
            "name": "suitableForEvents",
            "description": "Limit results to listings' unit type house rules",
            "required": false,
            "example": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "in": "query",
            "name": "suitableForChildren",
            "description": "Limit results to listings' unit type house rules",
            "required": false,
            "example": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "in": "query",
            "name": "suitableForInfants",
            "description": "Limit results to listings' unit type house rules",
            "required": false,
            "example": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "cursor",
            "in": "query",
            "description": "Provide cursor received from the response to iterate over pages",
            "required": false,
            "example": "eyJuZXh0Q3Vyc29yIjp7Imxpc3RpbmdJZCI6IjYwOWQ2YWI0MjU5ZWQxMDAyZDFlYWRjYiJ9fQ==",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "results": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ListingsListItem"
                      },
                      "description": "List of application listings filtered by given parameters"
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/PaginationWithCursor"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequest"
                }
              }
            }
          },
          "401": {
            "description": "Not authorized",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedError"
                }
              }
            }
          },
          "429": {
            "description": "Too many requests",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/TooManyRequestsError"
                }
              }
            }
          }
        }
      }
    }
  },
  "servers": [
    {
      "url": "https://booking.guesty.com"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "authorization"
      }
    },
    "schemas": {
      "BadRequest": {
        "type": "object",
        "properties": {
          "error": {
            "$ref": "#/components/schemas/ResponseErrorPayload"
          }
        }
      },
      "UnauthorizedError": {
        "type": "object",
        "properties": {
          "error": {
            "$ref": "#/components/schemas/ResponseErrorPayload"
          }
        }
      },
      "ResponseErrorPayload": {
        "type": "object",
        "required": [
          "code",
          "message",
          "data"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "data": {
            "type": "object",
            "required": [
              "requestId"
            ],
            "properties": {
              "requestId": {
                "type": "string"
              },
              "moreDetails": {
                "type": "object"
              }
            }
          }
        }
      },
      "TooManyRequestsError": {
        "type": "object",
        "properties": {
          "error": {
            "$ref": "#/components/schemas/ResponseErrorPayload"
          }
        }
      },
      "Amenities": {
        "type": "string",
        "enum": [
          "Accessible-height bed",
          "Accessible-height toilet",
          "Air conditioning",
          "Babysitter recommendations",
          "Baby bath",
          "Baby monitor",
          "Bathtub",
          "BBQ grill",
          "Beach essentials",
          "Bed linens",
          "Breakfast",
          "Cable TV",
          "Carbon monoxide detector",
          "Cat(s)",
          "Changing table",
          "Children's books and toys",
          "Children's dinnerware",
          "Cleaning before checkout",
          "Coffee maker",
          "Communal pool",
          "Cooking basics",
          "Crib",
          "Disabled parking spot",
          "Dishes and silverware",
          "Dishwasher",
          "Dog(s)",
          "Doorman",
          "Dryer",
          "Elevator in building",
          "Essentials",
          "Ethernet connection",
          "EV charger",
          "Extra pillows and blankets",
          "Fireplace guards",
          "Fire extinguisher",
          "Firm mattress",
          "First aid kit",
          "Flat smooth pathway to front door",
          "Free parking on premises",
          "Game console",
          "Garden or backyard",
          "Grab-rails for shower and toilet",
          "Gym",
          "Hair dryer",
          "Hangers",
          "Heating",
          "High chair",
          "Hot tub",
          "Hot water",
          "Indoor fireplace",
          "Indoor pool",
          "Internet",
          "Iron",
          "Kitchen",
          "Laptop friendly workspace",
          "Long term stays allowed",
          "Luggage dropoff allowed",
          "Microwave",
          "Other pet(s)",
          "Outdoor pool",
          "Outlet covers",
          "Oven",
          "Pack 'n Play/travel crib",
          "Path to entrance lit at night",
          "Patio or balcony",
          "Pets allowed",
          "Pets live on this property",
          "Pocket wifi",
          "Private entrance",
          "Private pool",
          "Refrigerator",
          "Roll-in shower with shower bench or chair",
          "Room-darkening shades",
          "Shampoo",
          "Single level home",
          "Smoke detector",
          "Smoking allowed",
          "Stair gates",
          "Step-free access",
          "Stove",
          "Suitable for children (2-12 years)",
          "Suitable for infants (under 2 years)",
          "Swimming pool",
          "Table corner guards",
          "Tub with shower bench",
          "TV",
          "Washer",
          "Wide clearance to bed",
          "Wide clearance to shower and toilet",
          "Wide doorway",
          "Wide hallway clearance",
          "Window guards",
          "Wireless Internet"
        ]
      },
      "Currency": {
        "type": "string",
        "enum": [
          "USD",
          "EUR",
          "AUD",
          "CAD",
          "JPY",
          "ILS",
          "GBP",
          "HKD",
          "NOK",
          "CZK",
          "BRL",
          "CHF",
          "THB",
          "ZAR",
          "MYR",
          "KRW",
          "IDR",
          "PHP",
          "INR",
          "NZD",
          "TWD",
          "PLN",
          "SGD",
          "TRY",
          "SEK",
          "VND",
          "ARS",
          "CNY",
          "DKK",
          "MXN"
        ]
      },
      "ListingAddress": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string"
          },
          "country": {
            "type": "string"
          },
          "full": {
            "type": "string"
          },
          "lat": {
            "type": "number"
          },
          "lng": {
            "type": "number"
          },
          "state": {
            "type": "string"
          },
          "street": {
            "type": "string"
          },
          "neighborhood": {
            "type": "string"
          }
        }
      },
      "ListingsListItem": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "example": "61f984538b908351a18d2c75"
          },
          "type": {
            "$ref": "#/components/schemas/ListingTypes"
          },
          "propertyType": {
            "$ref": "#/components/schemas/PropertyTypes"
          },
          "roomType": {
            "$ref": "#/components/schemas/RoomTypes"
          },
          "title": {
            "type": "string"
          },
          "accommodates": {
            "type": "integer"
          },
          "address": {
            "$ref": "#/components/schemas/ListingAddress"
          },
          "timezone": {
            "type": "string"
          },
          "amenities": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Amenities"
            }
          },
          "bathrooms": {
            "type": "integer",
            "minimum": 0,
            "example": 2
          },
          "bedrooms": {
            "type": "integer",
            "minimum": 0,
            "example": 2
          },
          "beds": {
            "type": "integer",
            "minimum": 0,
            "example": 2
          },
          "picture": {
            "type": "object",
            "properties": {
              "thumbnail": {
                "type": "string"
              },
              "regular": {
                "type": "string"
              },
              "large": {
                "type": "string"
              },
              "caption": {
                "type": "string"
              }
            }
          },
          "pictures": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ListingPicture"
            }
          },
          "prices": {
            "$ref": "#/components/schemas/ListingPrices"
          },
          "publicDescription": {
            "type": "object",
            "properties": {
              "summary": {
                "type": "string"
              }
            }
          },
          "allotment": {
            "type": "object",
            "description": "Depends on checkIn and checkOut",
            "example": {
              "2021-12-30": 2,
              "2021-12-31": 2
            }
          },
          "nightlyRates": {
            "type": "object",
            "description": "Depends on checkIn and checkOut",
            "example": {
              "2022-03-25": 100,
              "2022-03-26": 200
            }
          },
          "reviews": {
            "type": "object",
            "properties": {
              "avg": {
                "type": "number",
                "minimum": 0,
                "maximum": 10,
                "example": 10,
                "nullable": true
              },
              "total": {
                "type": "number",
                "minimum": 0,
                "example": 2
              }
            }
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": [
              "kinesu",
              "ExtendedStay"
            ]
          },
          "bedArrangements": {
            "$ref": "#/components/schemas/BedArrangements"
          },
          "unitTypeHouseRules": {
            "$ref": "#/components/schemas/UnitTypeHouseRules"
          }
        }
      },
      "ListingPicture": {
        "type": "object",
        "properties": {
          "original": {
            "type": "string"
          },
          "large": {
            "type": "string"
          },
          "regular": {
            "type": "string"
          },
          "thumbnail": {
            "type": "string"
          },
          "caption": {
            "type": "string"
          }
        }
      },
      "ListingPrices": {
        "type": "object",
        "properties": {
          "basePrice": {
            "type": "number",
            "example": 1
          },
          "currency": {
            "$ref": "#/components/schemas/Currency"
          },
          "monthlyPriceFactor": {
            "type": "number"
          },
          "weeklyPriceFactor": {
            "type": "number"
          },
          "extraPersonFee": {
            "type": "number"
          },
          "cleaningFee": {
            "type": "number"
          },
          "petFee": {
            "type": "number"
          }
        }
      },
      "ListingTypes": {
        "type": "string",
        "enum": [
          "SINGLE",
          "MTL"
        ]
      },
      "PaginationWithCursor": {
        "type": "object",
        "properties": {
          "total": {
            "type": "integer"
          },
          "cursor": {
            "type": "object",
            "properties": {
              "next": {
                "type": "string",
                "nullable": true
              }
            }
          }
        }
      },
      "PropertyTypes": {
        "type": "string",
        "enum": [
          "Apartment",
          "House",
          "Loft",
          "Boat",
          "Camper/RV",
          "Condominium",
          "Chalet",
          "Bed & Breakfast",
          "Villa",
          "Tent",
          "Other",
          "Cabin",
          "Townhouse",
          "Bungalow",
          "Hut",
          "Dorm",
          "Parking Space",
          "Plane",
          "Treehouse",
          "Yurt",
          "Tipi",
          "Igloo",
          "Earth House",
          "Island",
          "Cave",
          "Castle",
          "Studio"
        ]
      },
      "RoomTypes": {
        "type": "string",
        "enum": [
          "Private room",
          "Entire home/apt",
          "Shared room"
        ]
      },
      "BedArrangements": {
        "type": "object",
        "description": "To include bed arrangements to a response, please add bedArrangements to the fields in query params",
        "properties": {
          "unitTypeId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "unit type id"
          },
          "accountId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "account id"
          },
          "bedrooms": {
            "type": "array",
            "description": "bedroom description",
            "items": {
              "type": "object",
              "properties": {
                "roomNumber": {
                  "type": "number",
                  "description": "value of room numbers",
                  "x-example": 1
                },
                "name": {
                  "type": "string",
                  "description": "room name"
                },
                "type": {
                  "type": "string",
                  "description": "room type",
                  "enum": [
                    "BEDROOM",
                    "SHARED_SPACE"
                  ]
                },
                "beds": {
                  "type": "object",
                  "description": "beds description",
                  "properties": {
                    "KING_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "QUEEN_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "DOUBLE_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "SINGLE_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "SOFA_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "AIR_MATTRESS": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "BUNK_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "FLOOR_MATTRESS": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "WATER_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "TODDLER_BED": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    },
                    "CRIB": {
                      "type": "number",
                      "x-example": 1,
                      "default": 0
                    }
                  }
                }
              }
            }
          },
          "bedroomsAllowed": {
            "type": "boolean"
          },
          "isDefaultBedArrangement": {
            "type": "boolean"
          },
          "bathrooms": {
            "type": "object",
            "properties": {
              "BEDROOM": {
                "type": "number",
                "description": "value of bedroom numbers",
                "x-example": 1
              },
              "PRIVATE": {
                "type": "number",
                "description": "value of private numbers",
                "x-example": 1
              }
            },
            "description": "bathroom type"
          },
          "deleted": {
            "type": "boolean",
            "default": false
          },
          "deletedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "accountId",
          "unitTypeId",
          "deleted"
        ]
      },
      "UnitTypeHouseRules": {
        "type": "object",
        "properties": {
          "unitTypeId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "unit type id"
          },
          "houseRules": {
            "type": "object",
            "properties": {
              "additionalRules": {
                "type": "string"
              },
              "petsAllowed": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "chargeType": {
                    "type": "string"
                  }
                }
              },
              "quietBetween": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "hours": {
                    "type": "object",
                    "properties": {
                      "start": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "end": {
                        "type": "string",
                        "format": "date-time"
                      }
                    }
                  }
                }
              },
              "smokingAllowed": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  }
                }
              },
              "suitableForEvents": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  }
                }
              },
              "childrenRules": {
                "type": "object",
                "properties": {
                  "suitableForChildren": {
                    "type": "boolean"
                  },
                  "suitableForInfants": {
                    "type": "boolean"
                  },
                  "reason": {
                    "type": "string"
                  }
                }
              }
            },
            "description": "house rules details"
          },
          "deleted": {
            "type": "boolean",
            "default": false
          },
          "deletedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "unitTypeId",
          "houseRules",
          "deleted"
        ]
      }
    }
  }
}
```