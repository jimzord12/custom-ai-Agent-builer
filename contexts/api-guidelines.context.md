# API Design Guidelines

**Purpose**: Standards and best practices for designing consistent, maintainable APIs.

---

## RESTful API Principles

### 1. **Resource-Oriented Design**

- URLs represent resources, not actions
- Use nouns, not verbs in endpoint paths
- Plural nouns for collections: `/users`, `/products`

**Examples:**

```
✅ GET /users/123
✅ POST /users
✅ PUT /users/123
❌ GET /getUser/123
❌ POST /createUser
```

### 2. **HTTP Methods Usage**

- `GET` - Retrieve resource(s)
- `POST` - Create new resource
- `PUT` - Update/replace entire resource
- `PATCH` - Partial update of resource
- `DELETE` - Remove resource

### 3. **Status Codes**

Always use appropriate HTTP status codes:

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Client error (validation)
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

---

## URL Structure

### Hierarchy and Nesting

```
/resources/{id}/sub-resources/{id}
```

**Examples:**

```
GET /users/123/posts
GET /users/123/posts/456
POST /users/123/posts
```

**⚠️ Limit nesting to 2 levels maximum**

### Query Parameters

Use for filtering, sorting, pagination:

```
GET /users?status=active&role=admin
GET /products?sort=price&order=desc
GET /posts?page=2&limit=20
```

---

## Request/Response Format

### Request Body (POST/PUT/PATCH)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

### Response Body

Always include relevant data and metadata:

```json
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z",
    "version": "1.0"
  }
}
```

### Error Response

Consistent error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  }
}
```

---

## Versioning

Always version your APIs:

- **URL-based**: `/api/v1/users`, `/api/v2/users`
- **Header-based**: `Accept: application/vnd.api+json; version=1`

**Recommended**: URL-based versioning for clarity

---

## Authentication & Authorization

### Authentication

- Use JWT tokens or OAuth 2.0
- Include in `Authorization` header
- Format: `Authorization: Bearer <token>`

### Authorization

- Check permissions for each request
- Return `403 Forbidden` if not authorized
- Never expose sensitive data in error messages

---

## Pagination

For list endpoints, always support pagination:

```
GET /users?page=1&limit=20
```

**Response includes pagination metadata:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Naming Conventions

- **URLs**: lowercase with hyphens: `/user-profiles`
- **JSON fields**: camelCase: `firstName`, `createdAt`
- **Constants**: UPPER_SNAKE_CASE: `MAX_UPLOAD_SIZE`

---

## Documentation

- Use OpenAPI/Swagger specification
- Document all endpoints, parameters, responses
- Include examples for each endpoint
- Keep documentation in sync with implementation

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
