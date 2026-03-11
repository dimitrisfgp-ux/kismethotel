Create a reservation quote

# Create a reservation quote

Create a reservation quote to hold booking offer for certain period of time. A “default”/”standard” rate plan is supplied for properties that aren’t assigned to an active [Revenue Management Rate Plan](https://help.guesty.com/hc/en-gb/articles/9365605981469-Managing-rate-plans). Ensure you only use the rate plans supplied with the quote to create your reservation.
> ❗ Important
>
> Before using the Booking Engine (BE) API reservation endpoints, ensure your Guesty account is properly activated by following these steps:
> 1. Activate Manual Source (skip this step if you already have direct reservations in Guesty account):
>    - Create a manual reservation directly in the Guesty UI. This step is required to activate the "Manual" booking source in your account.
> 2. Activate BE API Source:
>    - Create your first reservation using the Booking Engine API endpoints.
>    - This step is essential to initialize the BE API source, which allows you to set up additional fees, taxes, auto payments and automated messages.

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
    "/api/reservations/quotes": {
      "post": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Create a reservation quote",
        "description": "Create a reservation quote to hold booking offer for certain period of time. A “default”/”standard” rate plan is supplied for properties that aren’t assigned to an active [Revenue Management Rate Plan](https://help.guesty.com/hc/en-gb/articles/9365605981469-Managing-rate-plans). Ensure you only use the rate plans supplied with the quote to create your reservation.\n> ❗ Important\n>\n> Before using the Booking Engine (BE) API reservation endpoints, ensure your Guesty account is properly activated by following these steps:\n> 1. Activate Manual Source (skip this step if you already have direct reservations in Guesty account):\n>    - Create a manual reservation directly in the Guesty UI. This step is required to activate the \"Manual\" booking source in your account.\n> 2. Activate BE API Source:\n>    - Create your first reservation using the Booking Engine API endpoints.\n>    - This step is essential to initialize the BE API source, which allows you to set up additional fees, taxes, auto payments and automated messages.",
        "operationId": "createReservationQuote",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateReservationQuoteRequestBody"
              }
            }
          },
          "description": "payload"
        },
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/ReservationQuoteResponseBody"
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
      "CreateReservationQuoteRequestBody": {
        "type": "object",
        "required": [
          "checkInDateLocalized",
          "checkOutDateLocalized",
          "listingId",
          "guestsCount"
        ],
        "properties": {
          "checkInDateLocalized": {
            "type": "string",
            "description": "Localized to listing timezone reservation checkin date",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "example": "2022-12-28"
          },
          "checkOutDateLocalized": {
            "type": "string",
            "description": "Localized to listing timezone reservation checkout date",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "example": "2023-01-15"
          },
          "listingId": {
            "type": "string",
            "description": "Listing ID",
            "example": "5bf544a600a9b000389f81d8"
          },
          "guestsCount": {
            "type": "integer",
            "default": 1,
            "description": "Guests quantity",
            "example": 1
          },
          "coupons": {
            "type": "string",
            "description": "The list of coupon codes joined by comma",
            "example": "DISCOUNT_50_$,DISCOUNT_60_$"
          }
        }
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
      "InvoiceItem": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          },
          "currency": {
            "$ref": "#/components/schemas/Currency"
          },
          "type": {
            "type": "string"
          },
          "normalType": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "includedTaxesList": {
            "type": "array",
            "description": "List of taxes included in this invoice item. This field shows the included taxes that apply on the invoice item and is relevant only for users with inclusive taxes enabled.",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "description": "Tax type identifier"
                },
                "normalType": {
                  "type": "string",
                  "description": "normalType of the tax"
                },
                "title": {
                  "type": "string",
                  "description": "tax name"
                }
              }
            }
          }
        }
      },
      "QuoteCouponsListItem": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "percentage"
            ]
          },
          "code": {
            "type": "string"
          },
          "adjustment": {
            "type": "integer"
          }
        }
      },
      "QuotePromotionListItem": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "adjustment": {
            "type": "integer"
          }
        }
      },
      "QuoteRatesListItem": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "mealPlans": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cancellationPolicy": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cancellationFee": {
            "type": "string"
          },
          "priceAdjustment": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "direction": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              }
            }
          },
          "days": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "date": {
                  "type": "string",
                  "format": "date"
                },
                "price": {
                  "type": "integer"
                },
                "currency": {
                  "type": "string"
                },
                "basePrice": {
                  "type": "integer"
                },
                "rateStrategy": {
                  "type": "integer"
                },
                "ratePlan": {
                  "type": "integer"
                },
                "lengthOfStay": {
                  "type": "integer"
                }
              }
            }
          },
          "money": {
            "type": "object",
            "properties": {
              "invoiceItems": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/InvoiceItem"
                }
              },
              "_id": {
                "type": "string"
              },
              "fareAccommodationAdjusted": {
                "type": "number"
              },
              "currency": {
                "$ref": "#/components/schemas/Currency"
              },
              "fareAccommodation": {
                "type": "number"
              },
              "fareCleaning": {
                "type": "number"
              },
              "totalFees": {
                "type": "number"
              },
              "subTotalPrice": {
                "type": "number"
              },
              "hostPayout": {
                "type": "number"
              },
              "hostPayoutUsd": {
                "type": "number"
              },
              "totalTaxes": {
                "type": "number"
              }
            }
          }
        }
      },
      "ReservationQuoteResponseBody": {
        "type": "object",
        "required": [
          "_id",
          "createdAt",
          "expiresAt",
          "promotions",
          "coupons",
          "rates"
        ],
        "properties": {
          "_id": {
            "type": "string",
            "description": "This is a quote id for creating instant/inquiry reservation"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "The quote was created at"
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time",
            "description": "The quote will be expired at"
          },
          "promotions": {
            "$ref": "#/components/schemas/QuotePromotionListItem"
          },
          "coupons": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/QuoteCouponsListItem"
            },
            "description": "List of coupons applied for the reservation quote"
          },
          "rates": {
            "type": "object",
            "properties": {
              "ratePlans": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/QuoteRatesListItem"
                }
              }
            }
          },
          "guestId": {
            "type": "string"
          }
        }
      }
    }
  }
}
```