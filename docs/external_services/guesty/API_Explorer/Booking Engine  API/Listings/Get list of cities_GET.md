Get list of cities

# Get list of cities

Returns a list of all the cities countries and states related to the booking engine listings

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
    "/api/listings/cities": {
      "get": {
        "tags": [
          "Listings"
        ],
        "summary": "Get list of cities",
        "description": "Returns a list of all the cities countries and states related to the booking engine listings",
        "operationId": "getCities",
        "parameters": [
          {
            "in": "query",
            "name": "skip",
            "description": "The number of cities to skip. Default value is 0",
            "example": 25,
            "schema": {
              "type": "integer",
              "minimum": 0
            }
          },
          {
            "in": "query",
            "name": "limit",
            "description": "Limit the number of results within a subset. Default value is 25, max value is 100",
            "example": 100,
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100
            }
          },
          {
            "in": "query",
            "name": "searchText",
            "description": "Search for given case insensitive text in city name",
            "example": "york",
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
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ListingsCitiesItem"
                      }
                    },
                    "count": {
                      "type": "integer"
                    },
                    "skip": {
                      "type": "integer"
                    },
                    "limit": {
                      "type": "integer"
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
      },
      "ListingsCitiesItem": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string"
          },
          "country": {
            "type": "string"
          },
          "state": {
            "type": "string"
          }
        }
      }
    }
  }
}
```