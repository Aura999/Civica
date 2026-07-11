# INTEGRATION MAP

Phase 1 static audit. Secret values were not inspected.

## MongoDB Atlas

- Files using it:
  - `server/config/database.js`
  - `server/index.js`
  - all Mongoose models/controllers indirectly
- Environment variables:
  - `MONGODB_URL`
- Initialization point:
  - `database.connect()` from backend startup.
- Failure handling:
  - Current Phase 0 patch awaits connection before listening and exits non-zero on failure.
- Latest runtime verification:
  - MongoDB connection was established successfully.
  - Express backend started successfully on port 4000 after MongoDB connected.
  - Backend startup now waits for MongoDB before listening.
  - MongoDB URI is no longer printed during startup.
- Future action:
  - Preserve MongoDB/Mongoose initially.
  - Refactor into modular data access/service layers.
  - Add transaction handling for multi-document writes.
- Security concern:
  - Previous URI logging was observed and patched in Phase 0.
- Runtime verification required:
  - No further basic startup verification is currently required based on latest evidence. Re-check Atlas cluster status, DNS/SRV resolution, network access, and credentials if connection failures recur.

## Cloudinary

- Files using it:
  - `server/config/cloudinary.js`
  - `server/utils/imageUploader.js`
  - `server/controllers/Course.js`
  - `server/controllers/Subsection.js`
  - `server/controllers/profile.js`
- Environment variables:
  - `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `FOLDER_NAME`
- Upload types:
  - Course thumbnail
  - Subsection/lesson video
  - User display picture
- Delete/update behavior:
  - Uploads create URLs.
  - No public ID is stored in models.
  - No confirmed Cloudinary delete cleanup on course, subsection, profile image, or account deletion.
- Future action:
  - Preserve media storage initially.
  - Refactor into media service.
  - Store public IDs for cleanup.
- Security concern:
  - Avoid logging upload details that may expose media metadata.
- Runtime verification required:
  - Cloudinary upload initialization, upload success, file size/type behavior, and cleanup expectations.

## Razorpay

- Frontend flow:
  - `studentFeaturesAPI.js` loads Razorpay checkout script.
  - `BuyCourse` calls capture payment, opens checkout, sends success email, verifies payment, resets cart.
  - Uses `rzp_logo.png`.
- Backend flow:
  - `server/routes/Payments.js`
  - `server/controllers/payments.js`
  - `server/config/razorpay.js`
  - capture creates Razorpay order; verify checks signature; enrollment happens after verify.
- Models affected:
  - `Course`
  - `user`
  - `CourseProgress`
- Email flow:
  - Payment success email.
  - Course enrollment email inside enrollment helper.
- Enrollment coupling:
  - Strong coupling. Enrollment writes are inside payment controller helper.
- Exact files to change/remove later:
  - `src/services/operations/studentFeaturesAPI.js`
  - `src/components/core/Dashboard/Cart/*`
  - `src/slices/cartSlice.js`
  - `src/assets/Logo/rzp_logo.png`
  - payment constants in `src/services/apis.js`
  - payment usage in `CourseDetails`/`CourseDetailsCard`
  - `server/routes/Payments.js`
  - `server/controllers/payments.js`
  - `server/config/razorpay.js`
  - `server/mail/templates/paymentSuccessEmail.js`
  - payment route registration in `server/index.js`
  - Razorpay env vars and dependencies
- Future action:
  - Remove, after free enrollment service/API exists.
- Security concern:
  - Signature verification must remain correct until removal.
- Runtime verification required:
  - Current cart, checkout, payment success, payment failure, and enrollment flows before replacing.

## Email

- Current utility:
  - `server/utils/mailSender.js` posts to Resend API using Axios.
- Legacy/commented utility:
  - Nodemailer implementation is commented out, but `nodemailer` remains in dependencies.
- Templates:
  - `contactFormRes.js`
  - `courseEnrollmentEmail.js`
  - `emailVerificationTemplate.js`
  - `passwordUpdate.js`
  - `paymentSuccessEmail.js`
- Trigger points:
  - OTP model pre-save hook.
  - Password update.
  - Password reset token.
  - Payment success.
  - Enrollment.
  - Contact form.
- Blocking versus non-blocking:
  - Most email sends are awaited in request/model execution path.
  - OTP email blocks model save hook.
- Failure handling:
  - Inconsistent. Some return error responses, some log, some continue based on mail response.
- Future action:
  - Refactor to email service and queue/non-blocking pattern where appropriate.
  - Remove Nodemailer dependency if Resend remains.
- Security concern:
  - Do not log email API credentials; avoid logging full user/request data.
- Runtime verification required:
  - OTP delivery, password reset email, payment email, enrollment email, contact email delivery, and sender configuration.

## Authentication

- JWT creation:
  - `server/controllers/Auth.js` login signs JWT with `JWT_SECRET`.
- JWT verification:
  - `server/middleware/auth.js` reads token from cookie, body, or Authorization header and verifies it.
- Token storage:
  - Backend sends cookie.
  - Frontend stores token in `localStorage` and Redux.
- Role middleware:
  - `isStudent`, `isInstructor`, `isAdmin` load user by email and check `accountType`.
- Password hashing:
  - bcrypt in signup, login compare, change password, reset password.
- OTP expiry:
  - TTL index via `createdAt.expires` in OTP schema.
- Reset-token handling:
  - User document stores `token` and `resetPasswordExpires`.
- Future action:
  - Refactor to Auth Context frontend, auth service backend, validation middleware, and consistent token handling.
- Security concern:
  - Token/user logging in middleware; reset token stored on user; no schema unique email constraint.
- Runtime verification required:
  - Login, signup, token expiry, logout, route guards, OTP delivery, OTP expiry, password reset email, and reset-token expiry.
