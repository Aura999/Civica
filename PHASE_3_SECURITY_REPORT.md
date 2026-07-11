# Phase 3 Security Report

## Scope

Phase 3 applied narrowly scoped backend security and startup-foundation changes. Frontend architecture, Redux, Razorpay business flow, database schemas, and RAG functionality were not migrated.

## Pre-change checkpoint

- Branch: `civica-ultimate`
- Pre-change commit hash: `920896b538780d2901c7e5c4a9b4d7134ec615ca`
- Pre-change working tree status: clean
- Pre-change staged files: none

## Files modified

- `server/.env.example`
- `server/app.js`
- `server/config/cloudinary.js`
- `server/config/env.js`
- `server/config/razorpay.js`
- `server/controllers/Auth.js`
- `server/controllers/Category.js`
- `server/controllers/ContactUs.js`
- `server/controllers/Course.js`
- `server/controllers/Section.js`
- `server/controllers/Subsection.js`
- `server/controllers/payments.js`
- `server/controllers/profile.js`
- `server/controllers/resetPassword.js`
- `server/index.js`
- `server/middleware/auth.js`
- `server/middleware/errorHandler.js`
- `server/middleware/notFound.js`
- `server/middleware/rateLimiters.js`
- `server/middleware/validate.js`
- `server/models/OTP.js`
- `server/package.json`
- `server/routes/Course.js`
- `server/routes/Payments.js`
- `server/routes/profile.js`
- `server/routes/user.js`
- `server/syncCategories.js`
- `server/tests/security.test.js`
- `server/utils/ApiError.js`
- `server/utils/ApiResponse.js`
- `server/utils/asyncHandler.js`
- `server/utils/imageUploader.js`
- `server/utils/ownership.js`
- `server/utils/sanitize.js`
- `server/validations/auth.validation.js`
- `server/validations/category.validation.js`
- `server/validations/common.validation.js`
- `server/validations/course.validation.js`
- `server/validations/payment.validation.js`
- `server/validations/profile.validation.js`
- `server/validations/review.validation.js`
- `server/vitest.config.js`
- `BACKEND_SECURITY_CHECKLIST.md`
- `PHASE_3_SECURITY_REPORT.md`

## Security issues fixed

- Course deletion is no longer publicly reachable.
- Course update and delete routes now require authenticated Instructor or Admin access plus course ownership checks.
- Section and subsection mutations now verify ownership through the parent course.
- Full course content now requires authenticated access plus enrollment, owner, or Admin authorization.
- Course progress updates and review creation now require student enrollment evidence.
- Auth middleware no longer logs decoded JWT payloads.
- Instructor route middleware no longer logs full user documents.
- OTP values are no longer returned by the OTP request endpoint.
- OTP email model logs no longer include mail provider response payloads.
- Profile, signup, login, and image update responses sanitize password/reset-token fields.
- Payment logs no longer print raw Razorpay order responses, full course documents, or full user documents.
- Contact form handling no longer logs the full request body.
- Cloudinary upload helper no longer logs upload options.
- A hardcoded JWT in `server/syncCategories.js` was replaced with `SYNC_CATEGORIES_TOKEN`.

## Route protections added

- `DELETE /api/v1/course/deleteCourse`: `auth`, Instructor/Admin role, request validation, course ownership.
- `POST /api/v1/course/editCourse`: `auth`, Instructor/Admin role, request validation, course ownership.
- `POST /api/v1/course/addSection`: `auth`, Instructor/Admin role, request validation, parent course ownership.
- `POST /api/v1/course/updateSection`: `auth`, Instructor/Admin role, request validation, parent course ownership.
- `POST /api/v1/course/deleteSection`: `auth`, Instructor/Admin role, request validation, parent course ownership.
- `POST /api/v1/course/addSubSection`: `auth`, Instructor/Admin role, request validation, parent course ownership through section.
- `POST /api/v1/course/updateSubSection`: `auth`, Instructor/Admin role, request validation, parent course ownership through section.
- `POST /api/v1/course/deleteSubSection`: `auth`, Instructor/Admin role, request validation, parent course ownership through section.
- `POST /api/v1/course/getFullCourseDetails`: `auth`, request validation, full-course access check.
- `POST /api/v1/course/updateCourseProgress`: `auth`, Student role, request validation, enrollment check.
- `POST /api/v1/course/createRating`: `auth`, Student role, request validation, enrollment check.
- `POST /api/v1/course/createCategory`: `auth`, Admin role, request validation.
- Payment endpoints retain Student-only protection and now validate expected request bodies.

## Ownership checks added

- Course ownership helper for course update/delete.
- Section parent-course ownership helper.
- Subsection parent-course ownership helper.
- Enrollment helper for progress and reviews.
- Full-course access helper for course player content.
- Admin bypass is supported only where appropriate.

## Validation schemas added

- Authentication: signup, login, OTP request, change password, forgot password, reset password.
- Course mutations: create course, edit course, section create/update/delete, subsection create/update/delete.
- Course access/progress: course ID body, progress update.
- Profile: update profile.
- Reviews: rating value and review text.
- Category: create category, category page lookup.
- Payments: capture payment, verify payment, payment-success email.

## Error handling foundation

- Added `asyncHandler`.
- Added `ApiError`.
- Added `ApiResponse`.
- Added centralized error middleware with standardized failure shape.
- Added standardized not-found middleware for unknown routes.
- Added `server/app.js` so tests can import the Express app without opening a listener.

## Environment validation behavior

- Startup validates required variable names without printing values.
- Required at startup: MongoDB URL, JWT secret, Cloudinary values, upload folder, and current mail API key.
- Optional or route-specific values are documented in `.env.example`, including Razorpay values and frontend origins.
- Real `.env` files were not edited.

## Security middleware added

- Helmet.
- CORS allowlist based on local development origins plus configured frontend origins.
- JSON and URL-encoded body size limits.
- Express file upload size limit.
- Authentication route rate limiting.
- Compression.

## Instructor approval behavior

- New Student accounts are approved immediately.
- New Instructor accounts are created with `approved: false`.
- Instructor-only route authorization rejects unapproved Instructor accounts.
- Login rejects unapproved Instructor accounts.
- No schema change was made; a later migration/admin workflow is still required for existing and future approvals.

## Sensitive response sanitization

- Signup response sanitizes User fields.
- Login response sanitizes User fields.
- Profile fetch/update/image responses sanitize User fields.
- Reset tokens and password hashes are removed from sanitized user output.

## Tests added

- Health endpoint.
- Standardized 404 response.
- Malformed login validation.
- Missing-token auth rejection.
- Unauthenticated course delete rejection.
- Safe error response without stack traces.

## Runtime verification results

- Backend tests: not executed in this shell because `npm` is not available on PATH.
- Backend startup: not executed in this shell because `node` is not available on PATH.
- Frontend startup: not executed during this Phase 3 run for the same toolchain limitation.
- Newly declared dependencies are not present in checked `server/node_modules`; installation is required before local runtime verification.

## Remaining risks

- Strict environment validation initially caused a runtime regression by treating `FOLDER_NAME` as startup-critical.
- `FOLDER_NAME` is now optional and resolves to the non-secret default folder `civica` when unset.
- No secret value was introduced for the upload folder default.
- Full route behavior still needs manual runtime testing after installing dependencies.
- Cloudinary uploads, email delivery, Razorpay checkout, enrollment, course player, and delete cascades remain unverified.
- Several legacy controllers still use inconsistent success/failure response shapes and should be migrated in a later phase.
- Payment and enrollment remain tightly coupled until the planned free-enrollment phase.
- Existing Instructor approval UI/workflow is incomplete without later product work.
- Some multi-document mutations still lack database transactions.

## Deferred issues

- No broad modular-monolith migration was performed.
- No schema migration was performed.
- No frontend state-management migration was performed.
- No payment removal was performed.
- No RAG functionality was introduced.

## Git/security inspection

- No tracked `.env` file was reported by `git ls-files .env server/.env client/.env frontend/.env`.
- `git grep` did not find JWT-shaped `eyJ` tokens under `server` after the patch.
- `git grep` did not find literal MongoDB connection strings under `server` after the patch.
- Important: because a previously tracked literal JWT was removed from `server/syncCategories.js`, the raw Git diff for that file contains the deleted token line. Do not paste that raw diff into public channels. Rotate or invalidate the exposed token.
