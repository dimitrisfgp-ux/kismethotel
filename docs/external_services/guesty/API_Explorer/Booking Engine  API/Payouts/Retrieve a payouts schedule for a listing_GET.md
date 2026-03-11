Retrieve a payouts schedule for a listing

# Retrieve a payouts schedule for a listing

This endpoint is used to retrieve a payouts schedule for a listing. It returns a list of payouts, including the payout amount, date, and status.

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
    "/api/reservations/payouts/list": {
      "get": {
        "tags": [
          "Payouts"
        ],
        "summary": "Retrieve a payouts schedule for a listing",
        "description": "This endpoint is used to retrieve a payouts schedule for a listing. It returns a list of payouts, including the payout amount, date, and status.",
        "operationId": "retrievePayoutsSchedule",
        "parameters": [
          {
            "name": "listingId",
            "in": "query",
            "description": "ID of listing",
            "required": true,
            "example": "5d6e7a7ebf8e380020773542",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "checkIn",
            "required": true,
            "description": "checkin day in format YYYY-MM-DD",
            "example": "2021-12-15",
            "schema": {
              "type": "string",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
            }
          },
          {
            "in": "query",
            "name": "checkOut",
            "required": true,
            "description": "checkout day in format YYYY-MM-DD",
            "example": "2021-12-20",
            "schema": {
              "type": "string",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
            }
          },
          {
            "in": "query",
            "name": "total",
            "required": true,
            "description": "Total reservation amount",
            "schema": {
              "type": "number"
            }
          },
          {
            "in": "query",
            "name": "bookingType",
            "required": true,
            "description": "Booking type",
            "schema": {
              "type": "string",
              "enum": [
                "INQUIRY",
                "INSTANT"
              ]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/RetrievePayoutsScheduleResponseBody"
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
      "RetrievePayoutsScheduleResponseBody": {
        "type": "object",
        "required": [
          "payments",
          "holds"
        ],
        "properties": {
          "payments": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "type",
                "amount"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "PAYMENT",
                    "AUTH_HOLD_CAPTURE"
                  ]
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string",
                  "description": "Scheduled date in format YYYY-MM-DD"
                },
                "after": {
                  "type": "number",
                  "description": "Number of days after a reference event when the payment occurs"
                },
                "tooltip": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "PERIOD",
                        "DURATION"
                      ]
                    },
                    "holdDays": {
                      "type": "number"
                    },
                    "holdDate": {
                      "type": "string",
                      "description": "Hold date in format YYYY-MM-DD"
                    },
                    "captureDate": {
                      "type": "string",
                      "description": "Capture date in format YYYY-MM-DD"
                    },
                    "holdAfter": {
                      "type": "number"
                    },
                    "captureAfter": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          },
          "holds": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "type",
                "amount",
                "date",
                "duration"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "AUTH_HOLD_RELEASE",
                    "AUTH_HOLD_CAPTURE",
                    "AUTH_HOLD",
                    "SECURITY_DEPOSIT"
                  ]
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string",
                  "description": "Hold date in format YYYY-MM-DD"
                },
                "duration": {
                  "type": "number",
                  "description": "Duration of the hold in days"
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