# RESTful API Documentation

## Overview

This document outlines the RESTful API design principles implemented in the Stock Management application.

## RESTful Design Principles

### 1. Resource-Based URLs
- Use nouns, not verbs in URLs
- Use plural nouns for collections
- Use hierarchical URLs for nested resources

### 2. HTTP Methods
- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update existing resources (full update)
- **PATCH**: Partial update (not implemented yet)
- **DELETE**: Remove resources

### 3. HTTP Status Codes
- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Portfolio API Endpoints

### Base URL: `/portfolio`

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/portfolio` | Get user's portfolio with pagination | 200 |
| GET | `/portfolio/:symbol` | Get specific stock from portfolio | 200 |
| POST | `/portfolio` | Add new stock to portfolio | 201 |
| PUT | `/portfolio/:symbol` | Update specific stock in portfolio | 200 |
| DELETE | `/portfolio/:symbol` | Remove specific stock from portfolio | 204 |
| DELETE | `/portfolio` | Clear entire portfolio | 204 |

### Request/Response Examples

#### GET /portfolio
```http
GET /portfolio?page=1&pageSize=10
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 10,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET /portfolio/:symbol
```http
GET /portfolio/AAPL
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "quantity": 10,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /portfolio
```http
POST /portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "GOOGL",
  "name": "Alphabet Inc.",
  "quantity": 5
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "user123",
    "symbol": "GOOGL",
    "name": "Alphabet Inc.",
    "quantity": 5,
    "addedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### PUT /portfolio/:symbol
```http
PUT /portfolio/AAPL
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Apple Inc. (Updated)",
  "quantity": 15
}
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "symbol": "AAPL",
    "name": "Apple Inc. (Updated)",
    "quantity": 15,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### DELETE /portfolio/:symbol
```http
DELETE /portfolio/AAPL
Authorization: Bearer <token>
```

Response (204 No Content):
```
(No response body)
```

#### DELETE /portfolio
```http
DELETE /portfolio
Authorization: Bearer <token>
```

Response (204 No Content):
```
(No response body)
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "BadRequestException",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/portfolio"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "UnauthorizedException",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/portfolio"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Portfolio entry not found for symbol: INVALID",
  "error": "PortfolioEntryNotFoundException",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/portfolio/INVALID"
}
```

## Authentication

All portfolio endpoints require JWT authentication via Bearer token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Pagination

List endpoints support pagination via query parameters:

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)

## Data Validation

### AddStockDto
- `symbol`: Required string, non-empty
- `name`: Required string, non-empty
- `quantity`: Required integer, minimum 1

### UpdateStockDto
- `name`: Required string, non-empty
- `quantity`: Required integer, minimum 1

## Implementation Benefits

1. **Consistent URL Structure**: All endpoints follow the same pattern
2. **Proper HTTP Methods**: Each operation uses the appropriate HTTP method
3. **Correct Status Codes**: Responses include meaningful HTTP status codes
4. **Resource-Based Design**: URLs represent resources, not actions
5. **Stateless**: Each request contains all necessary information
6. **Cacheable**: GET requests can be cached
7. **Layered System**: Client doesn't need to know about server implementation
8. **Uniform Interface**: Consistent API design across all endpoints 