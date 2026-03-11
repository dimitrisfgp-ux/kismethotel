Verify the payment for a reservation created with instant charge

# Verify the payment for a reservation created with instant charge

Verify the payment for a reservation created with instant charge when Guesty Pay is used. It should be called immediately after the `/instant-charge` endpoint when the returned payment has status `PENDING_AUTH`. If the 3DS verification succeeds, the payment is charged and the reservation is confirmed. If the verification fails, the reservation is closed.
> For providers with GuestyPay protect, the threeDSResult object is returned from the SDK handle3DSChallenge fuction and it should be sent here for 3DS challenge verification. If GuestyPay in EU/UK, this object is not necessary.

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
    "/api/reservations/{reservationId}/verify-payment": {
      "post": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Verify the payment for a reservation created with instant charge",
        "description": "Verify the payment for a reservation created with instant charge when Guesty Pay is used. It should be called immediately after the `/instant-charge` endpoint when the returned payment has status `PENDING_AUTH`. If the 3DS verification succeeds, the payment is charged and the reservation is confirmed. If the verification fails, the reservation is closed.\n> For providers with GuestyPay protect, the threeDSResult object is returned from the SDK handle3DSChallenge fuction and it should be sent here for 3DS challenge verification. If GuestyPay in EU/UK, this object is not necessary.",
        "operationId": "verifyChargeForReservationFromQuote",
        "parameters": [
          {
            "name": "reservationId",
            "in": "path",
            "description": "ID of reservation",
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
                "$ref": "#/components/schemas/VerifyChargeForReservationFromQuoteRequestBody"
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
                  "$ref": "#/components/schemas/VerifyChargeForReservationFromQuoteResponseBody"
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
            "description": "Reservation not found"
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
      "VerifyChargeForReservationFromQuoteRequestBody": {
        "type": "object",
        "required": [
          "paymentId"
        ],
        "properties": {
          "paymentId": {
            "type": "string",
            "description": "The payment ID from the PENDING_AUTH payment created in the `/instant-charge` endpoint.",
            "example": "5bf544a600a9b000389f81d8"
          },
          "threeDSResult": {
            "type": "object",
            "description": "The threeDSResult object returned from the SDK handle3DSChallenge function. This object must be sent here for 3DS challenge verification. If GuestyPay in EU/UK, this object is not necessary."
          }
        }
      },
      "VerifyChargeForReservationFromQuoteResponseBody": {
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