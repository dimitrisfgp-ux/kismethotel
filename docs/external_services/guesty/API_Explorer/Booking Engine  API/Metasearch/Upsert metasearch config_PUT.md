Upsert metasearch config

# Upsert metasearch config

Upsert metasearch config

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
    "/api/metasearch/pointofsale/{pointofsale}/config": {
      "put": {
        "tags": [
          "Metasearch"
        ],
        "summary": "Upsert metasearch config",
        "description": "Upsert metasearch config",
        "operationId": "upsertMetasearchConfig",
        "parameters": [
          {
            "name": "pointofsale",
            "in": "path",
            "description": "possible variants of pointofsale - google",
            "required": true,
            "example": "google",
            "schema": {
              "type": "string",
              "enum": [
                "google"
              ]
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "url"
                ],
                "properties": {
                  "url": {
                    "type": "string",
                    "description": "property page url defined based on metasearch requirements",
                    "example": "https://test-url.com/properties/(PARTNER-HOTEL-ID)?minOccupancy=(NUM-GUESTS)&amp;checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;pointofsale=google"
                  }
                }
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
                  "type": "object",
                  "properties": {
                    "url": {
                      "type": "string",
                      "description": "property page url defined based on metasearch requirements",
                      "example": "https://test-url.com/properties/(PARTNER-HOTEL-ID)?minOccupancy=(NUM-GUESTS)&amp;checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;pointofsale=google"
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
      }
    }
  }
}
```