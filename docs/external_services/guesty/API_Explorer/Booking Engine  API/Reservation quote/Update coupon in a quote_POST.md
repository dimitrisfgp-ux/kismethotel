Update coupon in a quote

# Update coupon in a quote

Ability to add/remove a coupon from existing quote.

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
    "/api/reservations/quotes/{quoteId}/coupons": {
      "post": {
        "tags": [
          "Reservation quote"
        ],
        "summary": "Update coupon in a quote",
        "description": "Ability to add/remove a coupon from existing quote.",
        "operationId": "manageRatePlanQuoteCoupons",
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
                "$ref": "#/components/schemas/ManageRatePlanQuoteCouponsRequestBody"
              }
            }
          },
          "description": "payload"
        },
        "responses": {
          "201": {
            "description": "successful operation"
          },
          "400": {
            "description": "Bad request",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequest"
                }
              }
            }
          },
          "401": {
            "description": "Not authorized",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ForbiddenError"
                }
              }
            }
          },
          "429": {
            "description": "Too many requests",
            "content": {
              "*/*": {
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
      "ManageRatePlanQuoteCouponsRequestBody": {
        "type": "object",
        "properties": {
          "coupons": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": [
              "coupon-1",
              "coupon-3"
            ],
            "description": "it will set quote coupons to coupon-1 and coupon-2 and if the quote had another ones the request will remove them"
          }
        }
      }
    }
  }
}
```