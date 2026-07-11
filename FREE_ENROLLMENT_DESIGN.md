# FREE ENROLLMENT DESIGN

## Primary endpoint

`POST /api/enrollments/:courseId`

## Rules

- Authenticated Student only.
- Course must exist.
- Course must be published.
- Duplicate enrollment must be rejected with `409` or treated idempotently. Target decision: return existing enrollment with `200` for idempotent UX.
- Instructor must not enroll in own course.
- Enrollment creation must be atomic.
- Course access must depend on enrollment.
- Progress state must initialize correctly.

## Request

```http
POST /api/enrollments/:courseId
Authorization: Bearer <token>
```

Body: none required for initial enrollment.

## Success response

```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "enrollment": {
      "course": "courseId",
      "student": "userId",
      "progressPercentage": 0,
      "completedLessons": [],
      "lastAccessedLesson": null,
      "status": "active"
    }
  }
}
```

## Error cases

| Case | Status | Message |
|---|---:|---|
| Missing auth | 401 | Authentication required |
| Non-student role | 403 | Only students can enroll |
| Course missing | 404 | Course not found |
| Course not published | 403 | Course is not available for enrollment |
| Instructor owns course | 403 | Instructors cannot enroll in their own course |
| Already enrolled | 200 or 409 | Already enrolled |
| Database failure | 500 | Could not enroll |

## Data writes

- Create `Enrollment`.
- Initialize `completedLessons: []`.
- Initialize `progressPercentage: 0`.
- Initialize `lastAccessedLesson: null`.
- Set `enrolledAt`.
- Set `status: active`.
- During compatibility phase, optionally mirror to `User.courses`, `Course.studentsEnroled`, and `CourseProgress` through one service only.

## Transaction needs

Use a MongoDB transaction when writing Enrollment plus any compatibility mirrors. If transactions are unavailable in local/dev topology, the service must fail clearly and avoid partial writes where possible.

## Frontend mutation flow

```text
Enroll button
  -> useEnrollInCourse(courseId)
  -> POST /api/enrollments/:courseId
  -> invalidate course detail
  -> invalidate my enrollments
  -> navigate to /learn/:courseId or update CTA
```

## Query invalidation

- `courses.detail(courseId)`
- `enrollments.me`
- `enrollments.detail(courseId)`
- `learning.content(courseId)`
- `instructor.analytics` if enrollment count is shown

## Related endpoints

### `GET /api/enrollments/me`

- Returns current student's enrollments with course summary and progress.
- Role: Student.

### `GET /api/enrollments/:courseId`

- Returns enrollment/access status for current student and course.
- Role: Student.

### `DELETE /api/enrollments/:courseId`

Decision: not required for resume-ready scope. If supported later, treat as withdrawal with `status: withdrawn` instead of hard delete to preserve progress/audit history.

## Legacy payment migration impact

- Extract enrollment helper out of `server/controllers/payments.js` first.
- Add enrollment service behind current payment flow.
- Add new free enrollment endpoint.
- Switch frontend CTA from cart/checkout to enroll mutation.
- Remove cart and Razorpay only after free enrollment is verified.
- Remove payment success email; keep enrollment email only if email delivery is verified and useful.

## Temporary compatibility considerations

- Old frontend may still expect enrolled courses from `/api/v1/profile/getEnrolledCourses`; provide adapter reads from `Enrollment` during migration.
- Old player may expect `CourseProgress`; compatibility service can mirror progress until player migrates.
