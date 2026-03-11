Get a specific listing

# Get a specific listing

This call returns a listing by ID

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
    "/api/listings/{listingId}": {
      "get": {
        "tags": [
          "Listings"
        ],
        "summary": "Get a specific listing",
        "description": "This call returns a listing by ID",
        "operationId": "getApplicationListing",
        "parameters": [
          {
            "name": "listingId",
            "in": "path",
            "description": "ID of listing",
            "required": true,
            "example": "5d6e7a7ebf8e3800207735ae",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "fields",
            "required": false,
            "description": "The list of the listing fields to return separated by spaces. The fields should be taken from Listing object definition. To include bed arrangements to a response, please add bedArrangements to the fields in query params.",
            "example": "_id address.city title accommodates",
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
                      "$ref": "#/components/schemas/Listing"
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
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/ForbiddenError"
                }
              }
            }
          },
          "404": {
            "description": "Listing not found"
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
      "ForbiddenError": {
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
      "GuestControls": {
        "type": "object",
        "properties": {
          "allowsChildren": {
            "type": "boolean"
          },
          "allowsInfants": {
            "type": "boolean"
          },
          "allowsPets": {
            "type": "boolean"
          },
          "allowsSmoking": {
            "type": "boolean"
          },
          "allowsEvents": {
            "type": "boolean"
          }
        }
      },
      "Listing": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
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
          "nickname": {
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
            "type": "integer"
          },
          "bedrooms": {
            "type": "integer"
          },
          "beds": {
            "type": "integer"
          },
          "bedType": {
            "type": "string"
          },
          "defaultCheckInTime": {
            "type": "string"
          },
          "defaultCheckOutTime": {
            "type": "string"
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
              "guestControls": {
                "$ref": "#/components/schemas/GuestControls"
              },
              "space": {
                "type": "string"
              },
              "access": {
                "type": "string"
              },
              "neighborhood": {
                "type": "string"
              },
              "transit": {
                "type": "string"
              },
              "notes": {
                "type": "string"
              },
              "interactionWithGuests": {
                "type": "string"
              },
              "summary": {
                "type": "string"
              },
              "houseRules": {
                "type": "string"
              }
            }
          },
          "terms": {
            "$ref": "#/components/schemas/Term"
          },
          "taxes": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Tax"
            }
          },
          "reviews": {
            "type": "object",
            "properties": {
              "avg": {
                "type": "number",
                "minimum": 0,
                "maximum": 10,
                "example": 3.5,
                "nullable": true
              },
              "total": {
                "type": "number",
                "minimum": 0,
                "example": 15
              }
            }
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "bedArrangements": {
            "$ref": "#/components/schemas/BedArrangements"
          },
          "unitTypeHouseRules": {
            "$ref": "#/components/schemas/UnitTypeHouseRules"
          },
          "autoPayments": {
            "$ref": "#/components/schemas/AutoPayments"
          }
        }
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
      "Tax": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          },
          "appliedToAllFees": {
            "type": "boolean"
          },
          "appliedOnFees": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "ADDITIONAL_BED",
                "AF",
                "AIR_CONDITIONING",
                "BABY_BED",
                "CAR_RENTAL",
                "CF",
                "CLUB_CARD",
                "COMMUNITY",
                "CONCIERGE",
                "EARLY_CHECKOUT",
                "LATE_CHECK_IN"
              ]
            }
          },
          "name": {
            "type": "string"
          },
          "quantifier": {
            "type": "string",
            "enum": [
              "PER_NIGHT",
              "PER_GUEST",
              "PER_GUEST_PER_NIGHT",
              "PER_STAY"
            ]
          },
          "type": {
            "type": "string",
            "enum": [
              "LOCAL_TAX",
              "CITY_TAX",
              "VAT",
              "GOODS_AND_SERVICES_TAX",
              "TOURISM_TAX",
              "OTHER"
            ]
          },
          "units": {
            "type": "string",
            "enum": [
              "PERCENTAGE",
              "FIXED"
            ]
          }
        }
      },
      "Term": {
        "type": "object",
        "properties": {
          "minNights": {
            "type": "integer"
          },
          "maxNights": {
            "type": "integer"
          },
          "cancellation": {
            "type": "string"
          }
        }
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
      },
      "AutoPayments": {
        "type": "object",
        "properties": {
          "policy": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "scheduleTo": {
                  "type": "object",
                  "properties": {
                    "reservationEvent": {
                      "type": "string",
                      "enum": [
                        "CHECK_IN",
                        "CHECK_OUT",
                        "CONFIRMATION"
                      ]
                    },
                    "timeRelation": {
                      "type": "object",
                      "properties": {
                        "relation": {
                          "type": "string",
                          "enum": [
                            "AT",
                            "BEFORE",
                            "AFTER"
                          ]
                        },
                        "unit": {
                          "type": "string",
                          "enum": [
                            "SECONDS",
                            "MINUTES",
                            "HOURS",
                            "DAYS"
                          ]
                        },
                        "amount": {
                          "type": "number"
                        }
                      }
                    }
                  }
                },
                "chargeAuthorizationHold": {
                  "type": "object",
                  "properties": {
                    "inUse": {
                      "type": "boolean"
                    },
                    "scheduleTo": {
                      "$ref": "#/components/schemas/ScheduleTo"
                    },
                    "chargeType": {
                      "type": "string",
                      "enum": [
                        "REST_OF_PAYMENT",
                        "PERCENTAGE",
                        "FIXED"
                      ]
                    },
                    "amount": {
                      "type": "number"
                    }
                  }
                },
                "releaseAuthorizationHold": {
                  "type": "object",
                  "properties": {
                    "inUse": {
                      "type": "boolean"
                    },
                    "scheduleTo": {
                      "$ref": "#/components/schemas/ScheduleTo"
                    },
                    "chargeType": {
                      "type": "string",
                      "enum": [
                        "REST_OF_PAYMENT",
                        "PERCENTAGE",
                        "FIXED"
                      ]
                    }
                  }
                },
                "chargeType": {
                  "type": "string",
                  "enum": [
                    "REST_OF_PAYMENT",
                    "PERCENTAGE",
                    "FIXED"
                  ]
                },
                "amount": {
                  "type": "number"
                },
                "useGuestCard": {
                  "type": "boolean"
                },
                "isAuthorizationHold": {
                  "type": "boolean"
                },
                "notifyIfHoldFails": {
                  "type": "boolean"
                },
                "whenContext": {
                  "type": "string",
                  "enum": [
                    "preConfirmation",
                    "checkIn",
                    "checkOut",
                    "confirmedAt"
                  ]
                }
              }
            }
          }
        }
      },
      "ScheduleTo": {
        "type": "object",
        "properties": {
          "reservationEvent": {
            "type": "string",
            "enum": [
              "CHECK_IN",
              "CHECK_OUT",
              "CONFIRMATION"
            ]
          },
          "timeRelation": {
            "type": "object",
            "properties": {
              "relation": {
                "type": "string",
                "enum": [
                  "AT",
                  "BEFORE",
                  "AFTER"
                ]
              },
              "unit": {
                "type": "string",
                "enum": [
                  "SECONDS",
                  "MINUTES",
                  "HOURS",
                  "DAYS"
                ]
              },
              "amount": {
                "type": "number"
              }
            }
          }
        }
      }
    }
  }
}
```