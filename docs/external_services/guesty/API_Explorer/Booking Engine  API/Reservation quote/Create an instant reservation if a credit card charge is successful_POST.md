Create an instant reservation if a credit card charge is successful

# Create an instant reservation if a credit card charge is successful

Create an instant reservation based on a quote, with an immediate charge using a Stripe confirmation token or the initialPaymentMethodId when GuestyPay is used. This endpoint allows you to charge a reservation before confirming the reservation. If the charge fails, the reservation is not created.
 Stripe's confirmation token is generated using Stripe frontend embedded component. See [Stripe docs](https://docs.stripe.com/payments/build-a-two-step-confirmation#create-ct) for more information.
>
> The initialPaymentMethodId is created using our dedicated SDK v2. Documentation can be found [here](https://github.com/guestyorg/tokenization-js/wiki/v2-Integration).
> Before requesting this endpoint, when GuestyPay is used, the SDK submit function must be called to get the initialPaymentMethodId. The payload option 1 should be used and the email must also be sent in the guest data. After this request, if the status of the payment is PENDING_AUTH, the `/verify-payment` endpoint must be called.
>
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
    "/api/reservations/quotes/{quoteId}/instant-charge": {
      "post": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Create an instant reservation if a credit card charge is successful",
        "description": "Create an instant reservation based on a quote, with an immediate charge using a Stripe confirmation token or the initialPaymentMethodId when GuestyPay is used. This endpoint allows you to charge a reservation before confirming the reservation. If the charge fails, the reservation is not created.\n Stripe's confirmation token is generated using Stripe frontend embedded component. See [Stripe docs](https://docs.stripe.com/payments/build-a-two-step-confirmation#create-ct) for more information.\n>\n> The initialPaymentMethodId is created using our dedicated SDK v2. Documentation can be found [here](https://github.com/guestyorg/tokenization-js/wiki/v2-Integration).\n> Before requesting this endpoint, when GuestyPay is used, the SDK submit function must be called to get the initialPaymentMethodId. The payload option 1 should be used and the email must also be sent in the guest data. After this request, if the status of the payment is PENDING_AUTH, the `/verify-payment` endpoint must be called.\n>\n> ❗ Important\n>\n> Before using the Booking Engine (BE) API reservation endpoints, ensure your Guesty account is properly activated by following these steps:\n> 1. Activate Manual Source (skip this step if you already have direct reservations in Guesty account):\n>    - Create a manual reservation directly in the Guesty UI. This step is required to activate the \"Manual\" booking source in your account.\n> 2. Activate BE API Source:\n>    - Create your first reservation using the Booking Engine API endpoints.\n>    - This step is essential to initialize the BE API source, which allows you to set up additional fees, taxes, auto payments and automated messages.",
        "operationId": "createInstantChargeReservationFromQuote",
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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateInstantChargeReservationFromQuoteRequestBody"
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
                  "$ref": "#/components/schemas/InstantChargeReservationFromQuoteResponseBody"
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
      "CreateInstantChargeReservationFromQuoteRequestBody": {
        "type": "object",
        "required": [
          "ratePlanId",
          "confirmationToken",
          "guest"
        ],
        "properties": {
          "ratePlanId": {
            "type": "string",
            "description": "Rate plan ID. Ensure you supply one of the rate plan IDs returned in the quote payload. Attempts to use any other string will result in an error.",
            "example": "5bf544a600a9b000389f81d8"
          },
          "reservedUntil": {
            "type": "integer",
            "description": "Time in hours to reserve the reservation for. Use -1 to keep calendar reserved. Valid values: -1, 12, 24, 36, 48, 72",
            "example": 12,
            "default": 12
          },
          "confirmationToken": {
            "type": "string",
            "description": "Confirmation token from Stripe frontend embedded component",
            "example": "ctoken_1QZvJiAAEsTuBlhIyegBgy7j"
          },
          "initialPaymentMethodId": {
            "type": "string",
            "description": "The payment method ID from our tokenization endpoint when provider is not Stripe. When using the initialPaymentMethodId, ccToken must not be provided.",
            "example": "5bf544a600a9b000389f81d8"
          },
          "reuse": {
            "type": "boolean",
            "description": "Whether to reuse the payment method for future charges",
            "default": false
          },
          "guest": {
            "type": "object",
            "required": [
              "firstName",
              "lastName",
              "email"
            ],
            "properties": {
              "firstName": {
                "type": "string",
                "description": "Name of the guest",
                "example": "Jhon"
              },
              "lastName": {
                "type": "string",
                "description": "Surname of the guest",
                "example": "Dou"
              },
              "email": {
                "type": "string",
                "description": "Email of the guest",
                "example": "jhon.dou@guesty.com"
              },
              "phone": {
                "type": "string",
                "description": "Phone number of the guest",
                "example": "380111111111"
              },
              "address": {
                "type": "object",
                "properties": {
                  "street": {
                    "type": "string",
                    "example": "1000 5th Ave"
                  },
                  "city": {
                    "type": "string",
                    "example": "New York"
                  },
                  "country": {
                    "type": "string",
                    "example": "United State"
                  },
                  "countryCode": {
                    "type": "string",
                    "example": "US"
                  },
                  "zipCode": {
                    "type": "string",
                    "example": "10028"
                  },
                  "state": {
                    "type": "string",
                    "example": "New York"
                  }
                }
              }
            }
          },
          "policy": {
            "type": "object",
            "properties": {
              "privacy": {
                "type": "object",
                "properties": {
                  "version": {
                    "type": "number",
                    "example": 1
                  },
                  "dateOfAcceptance": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2022-09-11"
                  },
                  "isAccepted": {
                    "type": "boolean",
                    "example": true
                  }
                }
              },
              "termsAndConditions": {
                "type": "object",
                "properties": {
                  "dateOfAcceptance": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2022-09-11"
                  },
                  "isAccepted": {
                    "type": "boolean",
                    "example": true
                  }
                }
              },
              "marketing": {
                "type": "object",
                "properties": {
                  "isAccepted": {
                    "type": "boolean",
                    "example": true
                  }
                }
              }
            }
          },
          "notes": {
            "type": "object",
            "description": "Additional notes for the reservation"
          }
        }
      },
      "InstantChargeReservationFromQuoteResponseBody": {
        "type": "object",
        "required": [
          "reservation",
          "payment"
        ],
        "properties": {
          "reservation": {
            "$ref": "#/components/schemas/RetrieveQuoteReservationResponseBody"
          },
          "payment": {
            "type": "object",
            "properties": {
              "_id": {
                "type": "string",
                "description": "Payment ID"
              },
              "status": {
                "type": "string",
                "description": "Payment status"
              },
              "amount": {
                "type": "number",
                "description": "Payment amount"
              },
              "currency": {
                "$ref": "#/components/schemas/Currency"
              },
              "reservationId": {
                "type": "string",
                "description": "ID of the reservation this payment is associated with"
              },
              "accountId": {
                "type": "string",
                "description": "ID of the account"
              },
              "paymentMethodId": {
                "type": "string",
                "description": "ID of the payment method used"
              },
              "attempts": {
                "type": "array",
                "description": "Payment attempt history",
                "items": {
                  "type": "object"
                }
              },
              "confirmationCode": {
                "type": "string",
                "description": "Processor confirmation code (not reservation confirmation code)"
              },
              "paidAt": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time when payment was completed"
              },
              "receiptId": {
                "type": "number",
                "description": "Receipt ID"
              },
              "error": {
                "type": "string",
                "description": "Error message if payment failed"
              },
              "processorError": {
                "type": "object",
                "properties": {
                  "code": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "threeDSChallenge": {
            "type": "object",
            "description": "The threeDSChallenge object returned for the SDK handle3DSChallenge function."
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
      "RetrieveQuoteReservationResponseBody": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "confirmedAt": {
            "type": "string",
            "format": "date-time"
          },
          "source": {
            "type": "string"
          },
          "secondarySource": {
            "type": "string"
          },
          "accountId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty account"
          },
          "confirmationCode": {
            "type": "string"
          },
          "platform": {
            "type": "string"
          },
          "bookerId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "status": {
            "type": "string"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "moneyId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "conversationId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "ratePlanId": {
            "type": "string"
          },
          "unitTypeId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "guestsCount": {
            "type": "number"
          },
          "checkInDateLocalized": {
            "type": "string",
            "description": "checkin day in format YYYY-MM-DD"
          },
          "checkOutDateLocalized": {
            "type": "string",
            "description": "checkout day in format YYYY-MM-DD"
          },
          "eta": {
            "type": "string",
            "format": "date-time"
          },
          "etd": {
            "type": "string",
            "format": "date-time"
          },
          "unitId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "stay": {
            "type": "array",
            "items": {
              "properties": {
                "checkInDateLocalized": {
                  "type": "string",
                  "description": "checkin day in format YYYY-MM-DD"
                },
                "checkOutDateLocalized": {
                  "type": "string",
                  "description": "checkout day in format YYYY-MM-DD"
                },
                "ratePlanId": {
                  "type": "string"
                },
                "unitTypeId": {
                  "type": "string",
                  "pattern": "^[0-9a-fA-F]{24}$"
                },
                "guestsCount": {
                  "type": "number"
                },
                "eta": {
                  "type": "string",
                  "format": "date-time"
                },
                "etd": {
                  "type": "string",
                  "format": "date-time"
                },
                "unitId": {
                  "type": "string",
                  "pattern": "^[0-9a-fA-F]{24}$"
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