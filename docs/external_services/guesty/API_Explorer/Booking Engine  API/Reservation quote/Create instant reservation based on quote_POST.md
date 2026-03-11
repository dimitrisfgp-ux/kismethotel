Create instant reservation based on quote

# Create instant reservation based on quote

Create instant reservation based on quote to use the same data which the quote holds. Pre-SCA Stripe tokens (starting with `tok_...`) are NOT SUPPORTED. The API supports only Stripe SCA tokens (starting with `pm_...`).
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
    "/api/reservations/quotes/{quoteId}/instant": {
      "post": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Create instant reservation based on quote",
        "description": "Create instant reservation based on quote to use the same data which the quote holds. Pre-SCA Stripe tokens (starting with `tok_...`) are NOT SUPPORTED. The API supports only Stripe SCA tokens (starting with `pm_...`).\n> ❗ Important\n>\n> Before using the Booking Engine (BE) API reservation endpoints, ensure your Guesty account is properly activated by following these steps:\n> 1. Activate Manual Source (skip this step if you already have direct reservations in Guesty account):\n>    - Create a manual reservation directly in the Guesty UI. This step is required to activate the \"Manual\" booking source in your account.\n> 2. Activate BE API Source:\n>    - Create your first reservation using the Booking Engine API endpoints.\n>    - This step is essential to initialize the BE API source, which allows you to set up additional fees, taxes, auto payments and automated messages.",
        "operationId": "createInstantReservationFromQuote",
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
                "$ref": "#/components/schemas/CreateInstantReservationFromQuoteRequestBody"
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
                  "$ref": "#/components/schemas/InstantReservationFromQuoteResponseBody"
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
      "CreateInstantReservationFromQuoteRequestBody": {
        "type": "object",
        "required": [
          "ratePlanId",
          "ccToken",
          "guest"
        ],
        "properties": {
          "ratePlanId": {
            "type": "string",
            "description": "Rate plan ID. Ensure you supply one of the rate plan IDs returned in the quote payload. Attempts to use any other string will result in an error.",
            "example": "5bf544a600a9b000389f81d8"
          },
          "ccToken": {
            "type": "string",
            "description": "payment token id, see tokenization guide https://booking-api-docs.guesty.com/docs/tokenizing-payment-methods",
            "example": "pm_1KTRn22eZvKYlo2CkHIARaGo"
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
          }
        }
      },
      "InstantReservationFromQuoteResponseBody": {
        "type": "object",
        "required": [
          "_id",
          "status",
          "platform",
          "confirmationCode",
          "createdAt",
          "guestId"
        ],
        "properties": {
          "_id": {
            "type": "string",
            "description": "ID of reservation",
            "example": "5d6e7a7ebf8e3800207735ae"
          },
          "status": {
            "type": "string",
            "enum": [
              "confirmed"
            ]
          },
          "platform": {
            "type": "string",
            "enum": [
              "direct"
            ]
          },
          "confirmationCode": {
            "type": "string",
            "description": "reservation confirmation code",
            "example": "4FDJO39DG33"
          },
          "createdAt": {
            "type": "string",
            "example": "11/7/2021, 3:57:29 PM"
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