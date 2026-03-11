Retrieve a reservation by ID

# Retrieve a reservation by ID

Retrieve a reservation created with quote by ID

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
    "/api/reservations/{reservationId}/details": {
      "get": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Retrieve a reservation by ID",
        "description": "Retrieve a reservation created with quote by ID",
        "operationId": "getQuoteReservationById",
        "parameters": [
          {
            "name": "reservationId",
            "in": "path",
            "description": "ID of reservation",
            "required": true,
            "example": "5d6e7a7ebf8e380020773542",
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
                  "$ref": "#/components/schemas/RetrieveQuoteReservationResponseBody"
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