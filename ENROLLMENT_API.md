# Enrollment API

Base paths:

- Target: `/api/enrollments`
- Temporary compatibility alias: `/api/v1/enrollments`

## Authentication

All enrollment endpoints require a valid JWT.

Role behavior:

- Student: can create and read own enrollments.
- Instructor: can list enrollments only for owned courses.
- Admin: can list enrollments for any course.

## `POST /api/enrollments/:courseId`

Enroll the authenticated Student in a published course for free.

### Request

```http
POST /api/enrollments/:courseId
Authorization: Bearer <token>
```

No request body is required.

### Success

New enrollment and duplicate retry both return `200`.

```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "enrollment": {
      "student": "userId",
      "course": "courseId",
      "completedLessons": [],
      "progressPercentage": 0,
      "lastAccessedLesson": null,
      "status": "active"
    },
    "courseAccessGranted": true
  }
}
```

Duplicate enrollment response:

```json
{
  "success": true,
  "message": "Already enrolled",
  "data": {
    "enrollment": {},
    "courseAccessGranted": true
  }
}
```

### Error cases

| Status | Case |
| --- | --- |
| 400 | Invalid `courseId` |
| 401 | Missing or invalid token |
| 403 | Authenticated user is not a Student |
| 403 | Course is not published |
| 403 | Instructor attempts to enroll in own course |
| 404 | Course not found |

## `GET /api/enrollments/me`

Return the authenticated Student's enrollments.

Optional query params:

- `page`
- `limit`

### Response

```json
{
  "success": true,
  "message": "Enrollments fetched successfully",
  "data": {
    "enrollments": []
  }
}
```

Course data is populated with course summary fields and sanitized instructor fields.

## `GET /api/enrollments/:courseId`

Return the authenticated user's enrollment/access status for a course.

### Response

```json
{
  "success": true,
  "message": "Enrollment status fetched successfully",
  "data": {
    "enrolled": true,
    "enrollment": {},
    "courseAccessGranted": true
  }
}
```

Legacy compatibility:

- If no `Enrollment` document exists but legacy evidence exists in `Course.studentsEnroled`, `User.courses`, or `CourseProgress`, the service lazily creates an `Enrollment`.

## `GET /api/enrollments/course/:courseId`

List enrollments for a course.

Access:

- Course owner Instructor.
- Admin.

Optional query params:

- `page`
- `limit`

### Response

```json
{
  "success": true,
  "message": "Course enrollments fetched successfully",
  "data": {
    "enrollments": []
  }
}
```

Student population is limited to basic identity fields.
