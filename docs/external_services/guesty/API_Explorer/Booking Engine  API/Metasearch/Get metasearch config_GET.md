Get metasearch config

# Get metasearch config

Get metasearch config

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
      "get": {
        "tags": [
          "Metasearch"
        ],
        "summary": "Get metasearch config",
        "description": "Get metasearch config",
        "operationId": "getMetasearchConfig",
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
        "responses": {
          "200": {
            "description": "Successful operation. Can be empty if no config provided",
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