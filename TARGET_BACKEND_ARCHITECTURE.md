# TARGET BACKEND ARCHITECTURE

## Target structure

```text
server/
  app.js
  server.js
  config/
    env.js
    database.js
    cloudinary.js
  middleware/
    authenticate.js
    authorize.js
    validate.js
    errorHandler.js
    notFound.js
    rateLimiters.js
  modules/
    auth/
    users/
    courses/
    categories/
    enrollments/
    progress/
    reviews/
    ai/
    contact/
  shared/
    asyncHandler.js
    ApiError.js
    ApiResponse.js
    uploadService.js
    emailService.js
    pagination.js
    routes.js
  tests/
```

Example module:

```text
modules/courses/
  course.model.js
  course.routes.js
  course.controller.js
  course.service.js
  course.validation.js
```

## Responsibilities

### Routes

- Define endpoint paths and HTTP methods.
- Attach validation.
- Attach authentication.
- Attach authorization.
- Call controller.
- Do not contain business rules or database orchestration.

### Controllers

- Read validated request data.
- Call one service method.
- Return standardized response.
- No complex business logic.
- No direct multi-model orchestration.
- No direct Cloudinary/email/RAG orchestration.

### Services

- Own business rules.
- Own ownership checks that require database context.
- Own multi-model workflows.
- Use transactions where necessary.
- Coordinate external integrations through shared services.
- Return plain data to controllers.

### Models

- Own persistence schema, constraints, indexes, and relationships.
- Keep hooks minimal.
- No email side effects.
- No unrelated business logic.
- No controller-specific formatting.

### Shared layer

- Generic cross-domain utilities only.
- Examples: `ApiError`, `ApiResponse`, `asyncHandler`, `uploadService`, `emailService`, pagination helpers, route combiner.
- Must not depend on feature modules.

## Request lifecycle

```text
Request
  -> Route
  -> Validation
  -> Authentication
  -> Authorization
  -> Controller
  -> Service
  -> Model
  -> Standardized response
```

## Response conventions

Success:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "Safe error message",
  "errors": []
}
```

## HTTP status-code usage

| Status | Usage |
|---|---|
| 200 | Successful read/update/action |
| 201 | Resource created |
| 204 | Successful delete with no body, if used consistently |
| 400 | Validation or malformed request |
| 401 | Missing/invalid authentication |
| 403 | Authenticated but forbidden role/ownership |
| 404 | Resource not found |
| 409 | Duplicate/conflict such as existing enrollment or review |
| 413 | Upload too large |
| 415 | Unsupported file type |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error with sanitized message |

## Module ownership

| Module | Owns |
|---|---|
| `auth` | signup, login, logout semantics, OTP, password reset/change, token creation |
| `users` | profile, user management, instructor approval, admin user actions |
| `courses` | course metadata, publish state, ownership, public catalog reads |
| `categories` | category CRUD and public category filters |
| `enrollments` | free enrollment, access checks, enrolled list, last lesson |
| `progress` | lesson completion and progress calculation |
| `reviews` | one review per enrolled student per course |
| `ai` | RAG ingestion, retrieval, answer generation, source management |
| `contact` | contact form submission and email trigger |

## Non-negotiable backend rules

- No route may mutate owned resources without authentication and authorization.
- Multi-document enrollment/progress writes must be atomic when MongoDB transactions are available.
- Services must not print secrets or full environment values.
- Controllers must not call Mongoose models directly after service extraction.
- Models must not send email.
- File uploads must validate type, size, and ownership before persistence is finalized.
