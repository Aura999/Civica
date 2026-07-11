# Phase 4 Enrollment Report

## Pre-change checkpoint

- Branch: `civica-ultimate`
- Pre-change commit hash: `ba59934c9adbbff869ea651aa17424b60b22d3d4`
- Pre-change working tree status: clean

## Files created

- `server/models/Enrollment.js`
- `server/modules/enrollments/enrollment.routes.js`
- `server/modules/enrollments/enrollment.controller.js`
- `server/modules/enrollments/enrollment.service.js`
- `server/modules/enrollments/enrollment.validation.js`
- `server/tests/enrollment.test.js`
- `ENROLLMENT_API.md`
- `PHASE_4_ENROLLMENT_REPORT.md`

## Files modified

- `server/app.js`
- `server/controllers/RatingandReview.js`
- `server/controllers/courseProgress.js`
- `server/controllers/payments.js`
- `server/controllers/profile.js`
- `server/package.json`
- `server/utils/ownership.js`
- `src/components/core/Course/CourseDetailsCard.jsx`
- `src/pages/CourseDetails.jsx`
- `src/services/apis.js`
- `src/services/operations/studentFeaturesAPI.js`

## Enrollment model

`Enrollment` contains:

- `student`: `ObjectId` reference to `user`, required.
- `course`: `ObjectId` reference to `Course`, required.
- `completedLessons`: array of `SubSection` IDs.
- `progressPercentage`: number, default `0`.
- `lastAccessedLesson`: optional `SubSection` ID.
- `status`: `active` or `completed`, default `active`.
- `enrolledAt`: defaults to current time.
- `completedAt`: optional date.
- Timestamps.

The model has a unique compound index on `{ student, course }`.

## Enrollment API

- `POST /api/enrollments/:courseId`
- `GET /api/enrollments/me`
- `GET /api/enrollments/:courseId`
- `GET /api/enrollments/course/:courseId`

Temporary compatibility alias:

- `/api/v1/enrollments`

## Transaction strategy

Enrollment creation writes:

- `Enrollment`
- `Course.studentsEnroled`
- `User.courses`
- `User.courseProgress`
- `CourseProgress`

The service attempts to use a MongoDB session transaction. If the local MongoDB topology does not support transactions, the service falls back to idempotent compatibility writes using unique indexes, upserts where appropriate, and `$addToSet`.

## Duplicate-enrollment behavior

Duplicate enrollment is idempotent:

- Returns `200`.
- Message: `Already enrolled`.
- Does not create duplicate `Enrollment`, `Course.studentsEnroled`, `User.courses`, or `User.courseProgress` entries.

## Legacy compatibility strategy

Lazy migration was chosen.

When enrollment status/access is requested:

- The service checks `Enrollment`.
- If absent, it checks legacy evidence in `Course.studentsEnroled`, `User.courses`, and `CourseProgress`.
- If legacy evidence exists, it creates one `Enrollment` document.
- Logs only a sanitized migration event.

Legacy arrays and `CourseProgress` remain for compatibility with current dashboard/player reads.

## Payment decoupling

`server/controllers/payments.js` no longer owns enrollment writes directly.

Payment verification and the existing free-course payment shortcut call `enrollmentService.enrollStudent(...)`. Razorpay routes remain in place and are now a deprecated bridge until the cart/payment UI is removed in a later phase.

## Course-access changes

`requireCourseEnrollment` and `requireFullCourseAccess` now use the enrollment service.

Rules:

- Public course detail remains preview-safe.
- Full course content requires enrolled Student, owner Instructor, or Admin.
- Legacy enrollment evidence can be lazily migrated before access is granted.

## Progress changes

Lesson completion now updates `Enrollment`:

- Adds completed lesson idempotently.
- Recalculates `progressPercentage`.
- Updates `lastAccessedLesson`.
- Marks enrollment `completed` and sets `completedAt` when all lessons are complete.

`CourseProgress.completedVideos` is synchronized temporarily for existing player compatibility.

## Review authorization changes

Review creation now requires:

- Authenticated Student.
- Enrollment verified through the enrollment service.
- One review per Student per course.
- Not the course Instructor.

## Frontend compatibility changes

- Added `FREE_ENROLL_API`.
- Added `freeEnroll(courseId, token, navigate)`.
- Course details CTA now shows `Enroll for Free` for Students.
- Logged-out users are prompted to log in.
- Enrolled Students see `Go To Course`.
- Instructor/Admin accounts see a disabled `Enrollment Unavailable` CTA.

Redux, cart state, and Razorpay frontend functions were not removed.

## Tests added

`server/tests/enrollment.test.js` covers:

- Published-course enrollment.
- Duplicate enrollment idempotency.
- Non-Student rejection.
- Unauthenticated rejection.
- Missing course.
- Unpublished course.
- Student enrollment list.
- Enrollment status lookup.
- Full content denied without enrollment.
- Full content allowed with enrollment.
- Progress denied without enrollment.
- Review denied without enrollment.
- Payment free-course path using enrollment state.
- Lazy legacy enrollment migration.

## Test and runtime results

Attempted in this shell:

- `npm test --prefix server`: failed before tests ran because `npm` is not available on PATH.
- `npm run dev`: failed before startup because `npm` is not available on PATH.

No backend tests, backend startup, frontend compilation, or browser workflows were verified in this shell.

## Remaining payment/cart dependencies

- Cart UI and Redux cart state remain.
- Razorpay frontend helper remains.
- Razorpay backend routes remain.
- Payment success email endpoint remains.
- Course price fields remain.

## Migration risks

- Existing legacy enrollments may be partially inconsistent across `User.courses`, `Course.studentsEnroled`, and `CourseProgress`.
- Transaction support depends on MongoDB topology.
- Some frontend enrollment state still derives from `Course.studentsEnroled` until the UI migrates fully to `GET /api/enrollments/:courseId`.
- Payment flow was not externally verified.

## Deferred cleanup

- Remove cart UI.
- Remove Razorpay routes and package.
- Remove payment success email.
- Move all enrollment/progress reads to `Enrollment`.
- Deprecate `CourseProgress`.
- Remove legacy enrollment arrays after migration and verification.
