# TARGET ROUTE MAP

## Frontend routes

### Public

| Route | Role access | Layout | Required query | Required backend APIs | Redirect behavior | Empty state | Error state |
|---|---|---|---|---|---|---|---|
| `/` | All | `PublicLayout` | None | optional featured courses | None | show mission-focused landing | show non-blocking content fallback |
| `/about` | All | `PublicLayout` | None | None | None | static content | static fallback |
| `/contact` | All | `PublicLayout` | None | `POST /api/contact` | None | contact form | form error toast/inline errors |
| `/courses` | All | `PublicLayout` | `q`, `category`, `page`, `sort` optional | `GET /api/courses`, `GET /api/categories` | None | no courses match filters | retryable list error |
| `/courses/:courseId` | All | `PublicLayout` | None | `GET /api/courses/:courseId`, optional enrollment status for auth user | None | course unavailable | 404 or unavailable state |
| `/login` | Anonymous | `AuthLayout` | optional `redirectTo` | `POST /api/auth/login` | authenticated users redirect to dashboard/redirectTo | N/A | validation/auth error |
| `/signup` | Anonymous | `AuthLayout` | optional role | `POST /api/auth/send-otp`, `POST /api/auth/signup` | authenticated users redirect to dashboard | N/A | validation/auth error |
| `/verify-email` | Anonymous in signup flow | `AuthLayout` | email/session token if needed | `POST /api/auth/verify-email` or signup verification endpoint | missing signup context redirects to signup | N/A | OTP error/expired |
| `/forgot-password` | Anonymous | `AuthLayout` | None | `POST /api/auth/forgot-password` | authenticated users redirect to dashboard | N/A | email error |
| `/reset-password/:token` | Anonymous | `AuthLayout` | None | `POST /api/auth/reset-password` | success redirects to login | N/A | invalid/expired token |

### Dashboard

| Route | Role access | Layout | Required query | Required backend APIs | Redirect behavior | Empty state | Error state |
|---|---|---|---|---|---|---|---|
| `/dashboard` | Authenticated | `DashboardLayout` | None | current user query | role-based default child | show welcome | session error redirects login |
| `/dashboard/profile` | Authenticated | `DashboardLayout` | None | `GET/PUT /api/users/me` | unauthenticated to login | profile skeleton/empty fields | profile load error |
| `/dashboard/my-learning` | Student | `DashboardLayout` | `page` optional | `GET /api/enrollments/me` | non-student to dashboard | no enrollments | retryable list error |
| `/dashboard/my-courses` | Instructor | `DashboardLayout` | status/page optional | `GET /api/courses/mine` | non-instructor to dashboard | no owned courses | retryable list error |
| `/dashboard/courses/new` | Instructor | `DashboardLayout` | None | `POST /api/courses/drafts` | non-instructor to dashboard | draft creation prompt | draft create error |
| `/dashboard/courses/:courseId/edit` | Instructor owner/Admin | `DashboardLayout` | step optional | course draft/content APIs | unauthorized to dashboard | missing draft | 403/404 editor state |
| `/dashboard/instructor/analytics` | Instructor | `DashboardLayout` | range optional | `GET /api/users/me/instructor-analytics` | non-instructor to dashboard | no published courses | analytics error |
| `/dashboard/admin/users` | Admin | `DashboardLayout` | role/status/page optional | `GET /api/users`, admin user actions | non-admin to dashboard | no users | admin API error |
| `/dashboard/admin/instructors` | Admin | `DashboardLayout` | status/page optional | `GET /api/users?role=Instructor`, approve/reject | non-admin to dashboard | no pending instructors | admin API error |
| `/dashboard/admin/courses` | Admin | `DashboardLayout` | status/category/page optional | admin course moderation APIs | non-admin to dashboard | no courses | admin API error |
| `/dashboard/admin/categories` | Admin | `DashboardLayout` | None | category CRUD APIs | non-admin to dashboard | no categories | category API error |

### Learning

| Route | Role access | Layout | Required query | Required backend APIs | Redirect behavior | Empty state | Error state |
|---|---|---|---|---|---|---|---|
| `/learn/:courseId` | Enrolled Student, Admin preview optional | `LearningLayout` | None | `GET /api/enrollments/:courseId`, `GET /api/courses/:courseId/content` | unenrolled to course details | no lessons | 403/404 learning state |
| `/learn/:courseId/:lessonId` | Enrolled Student, Admin preview optional | `LearningLayout` | None | content, progress, AI query APIs | invalid lesson to `/learn/:courseId` | no lesson selected | 403/404 lesson state |

## Backend endpoint groups

### `/api/auth`

- `POST /api/auth/signup`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`
- `GET /api/auth/session`

### `/api/users`

- `GET /api/users/me`
- `PATCH /api/users/me`
- `PATCH /api/users/me/avatar`
- `DELETE /api/users/me`
- `GET /api/users` Admin
- `PATCH /api/users/:userId/status` Admin
- `PATCH /api/users/:userId/approve-instructor` Admin
- `PATCH /api/users/:userId/reject-instructor` Admin

### `/api/courses`

- `GET /api/courses`
- `GET /api/courses/:courseId`
- `GET /api/courses/:courseId/content`
- `GET /api/courses/mine` Instructor
- `POST /api/courses/drafts` Instructor
- `PATCH /api/courses/:courseId` Instructor owner/Admin
- `POST /api/courses/:courseId/thumbnail` Instructor owner/Admin
- `POST /api/courses/:courseId/sections` Instructor owner/Admin
- `PATCH /api/courses/:courseId/sections/:sectionId`
- `POST /api/courses/:courseId/sections/:sectionId/lessons`
- `PATCH /api/courses/:courseId/lessons/:lessonId`
- `POST /api/courses/:courseId/publish`
- `POST /api/courses/:courseId/unpublish`
- `DELETE /api/courses/:courseId`

### `/api/categories`

- `GET /api/categories`
- `POST /api/categories` Admin
- `PATCH /api/categories/:categoryId` Admin
- `DELETE /api/categories/:categoryId` Admin

### `/api/enrollments`

- `POST /api/enrollments/:courseId`
- `GET /api/enrollments/me`
- `GET /api/enrollments/:courseId`
- `DELETE /api/enrollments/:courseId` only if withdrawal is intentionally supported

### `/api/progress`

- `PATCH /api/progress/:courseId/lessons/:lessonId/complete`
- `PATCH /api/progress/:courseId/last-accessed`
- `GET /api/progress/:courseId`

### `/api/reviews`

- `POST /api/reviews/:courseId`
- `GET /api/reviews/course/:courseId`
- `PATCH /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`

### `/api/ai`

- `POST /api/ai/courses/:courseId/sources`
- `POST /api/ai/courses/:courseId/query`
- `POST /api/ai/courses/:courseId/sources/:sourceId/reindex`
- `DELETE /api/ai/courses/:courseId/sources/:sourceId`

### `/api/contact`

- `POST /api/contact`

### `/api/health`

- `GET /api/health`

## Temporary compatibility aliases

| Legacy endpoint | Target endpoint | Compatibility need |
|---|---|---|
| `/api/v1/auth/login` | `/api/auth/login` | Temporary alias during frontend migration |
| `/api/v1/auth/signup` | `/api/auth/signup` | Temporary alias during auth migration |
| `/api/v1/auth/sendotp` | `/api/auth/send-otp` | Temporary alias during OTP migration |
| `/api/v1/profile/getUserDetails` | `/api/users/me` | Temporary alias during Auth Context migration |
| `/api/v1/course/getAllCourses` | `/api/courses` | Temporary alias during catalog migration |
| `/api/v1/course/getCourseDetails` | `/api/courses/:courseId` | Temporary alias or frontend adapter |
| `/api/v1/course/getFullCourseDetails` | `/api/courses/:courseId/content` | Temporary alias during learning migration |
| `/api/v1/course/updateCourseProgress` | `/api/progress/:courseId/lessons/:lessonId/complete` | Temporary alias during player migration |
| `/api/v1/profile/getEnrolledCourses` | `/api/enrollments/me` | Temporary alias during enrollment migration |
| `/api/v1/reach/contact` | `/api/contact` | Temporary alias during contact migration |

Payment endpoints should not be preserved beyond the free-enrollment cutover except as short-lived no-op/deprecation responses if needed for safe deployment.
