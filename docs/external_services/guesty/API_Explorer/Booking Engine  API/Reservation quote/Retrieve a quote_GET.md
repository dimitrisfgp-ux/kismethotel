Retrieve a quote

# Retrieve a quote

Retrieve a quote by ID.

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
    "/api/reservations/quotes/{quoteId}": {
      "get": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Retrieve a quote",
        "description": "Retrieve a quote by ID.",
        "operationId": "retrieveQuoteById",
        "parameters": [
          {
            "name": "quoteId",
            "in": "path",
            "description": "ID of quote",
            "required": true,
            "example": "5d6e7a7ebf8e3800207735ae",
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
                  "$ref": "#/components/schemas/RetrieveQuoteResponseBody"
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
            "description": "Quote not found"
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
      "RetrieveQuoteResponseBody": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time"
          },
          "promotions": {
            "$ref": "#/components/schemas/QuotePromotionListItem"
          },
          "coupons": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/QuoteCouponsListItem"
            }
          },
          "rates": {
            "type": "object",
            "properties": {
              "quoteId": {
                "type": "string",
                "description": "A specific financial calculation process in scope of which it was done (quote based on specific rate plan only"
              },
              "ratePlans": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/QuoteRatesListItem"
                }
              }
            }
          }
        }
      }
    }
  }
}
```