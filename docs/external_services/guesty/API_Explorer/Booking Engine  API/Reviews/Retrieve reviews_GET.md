Retrieve reviews

# Retrieve reviews

Get reviews list by parameters

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
    "/api/reviews": {
      "get": {
        "tags": [
          "Reviews"
        ],
        "summary": "Retrieve reviews",
        "description": "Get reviews list by parameters",
        "operationId": "getReviewsList",
        "parameters": [
          {
            "in": "query",
            "name": "skip",
            "required": false,
            "description": "The number of items to skip before starting to collect the result set.",
            "example": 0,
            "schema": {
              "type": "integer",
              "minimum": 0
            }
          },
          {
            "in": "query",
            "name": "limit",
            "required": false,
            "description": "The numbers of items to return.",
            "example": 100,
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100
            }
          },
          {
            "in": "query",
            "name": "channelId",
            "required": false,
            "description": "Channel name.",
            "example": "airbnb2",
            "schema": {
              "type": "string",
              "enum": [
                "airbnb2",
                "bookingCom"
              ]
            }
          },
          {
            "in": "query",
            "name": "listingId",
            "required": false,
            "description": "Guesty listingId.",
            "example": "5d6e7a7ebf8e3800207735ae",
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            }
          },
          {
            "in": "query",
            "name": "reservationId",
            "required": false,
            "description": "Guesty reservationId.",
            "example": "5d6e7a7ebf8e3800207735ae",
            "schema": {
              "type": "string",
              "pattern": "^[0-9a-fA-F]{24}$"
            }
          },
          {
            "in": "query",
            "name": "externalReservationId",
            "description": "Channel reservationId.",
            "example": "2845111736",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "externalReviewId",
            "required": false,
            "description": "Channel reviewId. If this param is passed, others will be skipped",
            "example": "7KHbotVSjAEtesr",
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "startDate",
            "required": false,
            "description": "Start date-time of get reviews.",
            "example": "2021-12-15",
            "schema": {
              "type": "string",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
            }
          },
          {
            "in": "query",
            "name": "endDate",
            "required": false,
            "description": "End date-time of get reviews.",
            "example": "2021-12-16",
            "schema": {
              "type": "string",
              "format": "date-time",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
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
                    "limit": {
                      "type": "number",
                      "minimum": 1,
                      "maximum": 100,
                      "default": 100
                    },
                    "skip": {
                      "type": "number",
                      "minimum": 0,
                      "default": 0
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Review"
                      }
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
      "Review": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty review"
          },
          "accountId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty account"
          },
          "externalReviewId": {
            "type": "string",
            "description": "id of review in channel"
          },
          "channelId": {
            "type": "string",
            "description": "channel id",
            "enum": [
              "bookingCom",
              "airbnb2"
            ]
          },
          "subListingId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty MU child listing in case related reservation is assigned to it"
          },
          "listingId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty listing that integrated with channel or related reservation is assigned to"
          },
          "complexId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty complex if listing integrated with channel is assigned to"
          },
          "externalListingId": {
            "type": "string",
            "description": "id of airbnb listing or booking.com room to which review belong to"
          },
          "externalComplexId": {
            "type": "string",
            "description": "id of hotel for booking.com, empty for airbnb"
          },
          "reservationId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of Guesty reservation linked to review"
          },
          "externalReservationId": {
            "type": "string",
            "description": "id of linked reservation in channel"
          },
          "guestId": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$",
            "description": "id of guest in Guesty"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "date-time of creation in channel"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "date-time of last update in channel"
          },
          "rawReview": {
            "type": "object",
            "description": "raw review object received from channel"
          },
          "reviewReplies": {
            "type": "array",
            "items": {
              "properties": {
                "reviewReply": {
                  "type": "string",
                  "description": "text of reply"
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "COMPLETED",
                    "FAILED",
                    "PENDING"
                  ]
                },
                "replyAt": {
                  "type": "string",
                  "format": "date-time"
                }
              }
            }
          }
        },
        "required": [
          "_id",
          "accountId",
          "externalReviewId",
          "externalListingId",
          "externalReservationId",
          "channelId",
          "listingId",
          "rawReview",
          "createdAt",
          "updatedAt"
        ]
      }
    }
  }
}
```