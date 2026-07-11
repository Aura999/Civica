# CURRENT STATE

## Project identity

- Project name: CIVICA, implemented in a codebase still named `studynotion-client` / `studynotion-backend` in package manifests.
- Current product positioning: full-stack EdTech/course learning platform with public catalog, paid checkout, enrollment, course playback, progress tracking, instructor course management, and profile workflows.
- Current architecture style: React single-page frontend plus Express/Mongoose backend. The backend is organized by routes, controllers, models, middleware, config, utilities, and mail templates.
- Frontend location: repository root React app, with source under `src/`.
- Backend location: `server/`.
- Current deployment-related files: root `package.json` build scripts, `public/_redirects`, `build/` output directory present locally. No checked-in Vercel/Netlify/Render/Railway/Fly configuration was found outside dependency folders.

## Current technology stack

### Frontend

- React 18, React DOM, Create React App (`react-scripts`)
- React Router DOM v6
- Axios
- React Hot Toast
- React Hook Form is present in dependencies and source imports for course/profile forms
- Chart.js and `react-chartjs-2` for instructor dashboard charts
- Swiper for sliders
- `video-react` for course playback
- `react-icons`, `react-rating-stars-component`, `react-otp-input`, `react-dropzone`, `react-super-responsive-table`

### Backend

- Node.js
- Express
- Express File Upload
- Cookie Parser
- CORS
- Axios
- Node Schedule is listed in dependencies

### Database

- MongoDB through Mongoose

### Authentication

- JWT with `jsonwebtoken`
- Password hashing with `bcryptjs`
- OTP generation with `otp-generator`
- Auth middleware in `server/middleware/auth.js`

### File storage

- Cloudinary via `cloudinary`

### Payments

- Razorpay via `razorpay`
- Razorpay Checkout SDK loaded on the frontend from `https://checkout.razorpay.com/v1/checkout.js`

### Email

- Current mail sender uses Resend HTTP API through Axios in `server/utils/mailSender.js`
- Nodemailer is present in backend dependencies and commented legacy code

### State management

- Redux Toolkit
- React Redux
- Root reducer combines `auth`, `profile`, `course`, `cart`, and `viewCourse` slices

### Styling

- Tailwind CSS
- `App.css`

### Testing

- Frontend package includes CRA testing dependencies and `npm test` script.
- No checked-in `*.test.*`, `*.spec.*`, or `__tests__` files were found by static filename search.
- Backend package has no test script in `server/package.json`.

### Deployment

- CRA build script: `npm run build`
- SPA redirect file: `public/_redirects`
- Local `build/` output directory is present but ignored by root `.gitignore`

## Current features

### Public visitor

- Confirmed implemented: landing page, about page, contact page, catalog page, public course details, public course list/category data endpoints, public ratings list endpoint.
- Present in code but not verified at runtime: review slider, catalog recommendation data, public course cards.

### Student

- Confirmed implemented: student account type, enrolled courses page, cart page, checkout entry point, course player route, progress update API, review creation API.
- Present in code but not verified at runtime: full enrolled-course playback and persisted progress behavior.

### Instructor

- Confirmed implemented: instructor account type, instructor dashboard route, my courses, add course, edit course, create/update/delete section, create/update/delete subsection, thumbnail/video uploads, instructor dashboard API.
- Present in code but not verified at runtime: dashboard chart correctness and course editing edge cases.

### Admin

- Confirmed implemented: `Admin` account type in `User` model, `isAdmin` middleware, protected `createCategory` route.
- Partially implemented: no confirmed frontend admin route or admin dashboard screen was found in `src/App.jsx` or dashboard links.

### Authentication

- Confirmed implemented: signup, OTP send and verify during signup, login, logout, forgot password token, reset password, change password, private/open route wrappers, role checks for student/instructor/admin middleware.
- Present in code but not verified at runtime: OTP expiration behavior, password reset email link behavior.

### Course management

- Confirmed implemented: course create/edit/delete, course categories, course details, instructor course listing, section and subsection CRUD, draft/published status field.
- Present in code but not verified at runtime: media cleanup after course/section/subsection deletion.

### Learning and progress

- Confirmed implemented: authenticated full course details, course player route, video detail component, course progress model, mark lecture complete endpoint, enrolled course progress percentage calculation.
- Present in code but not verified at runtime: persistence across reload/session and duplicate-completion UX.

### Payments

- Confirmed implemented: cart slice and cart UI, Razorpay order creation, Razorpay payment verification, payment success email, enrollment after payment.
- Partially implemented: free-course enrollment branch exists in payment controller, while frontend payment flow still expects Razorpay order data.

### Reviews

- Confirmed implemented: create review for enrolled students, prevent duplicate review per user/course, list all reviews, average rating endpoint.
- Present in code but not verified at runtime: frontend review modal submission flow.

### Profile

- Confirmed implemented: view profile, update profile, update display picture, change password, delete account, get enrolled courses.
- Present in code but not verified at runtime: account deletion cascading effects.

### Communication and email

- Confirmed implemented: contact form API, OTP email hook on OTP save, password update email, password reset email, payment success email, course enrollment email.
- Present in code but not verified at runtime: deliverability and configured sender behavior.

## Current frontend architecture

- Entry point: `src/index.js` creates React root, configures Redux store with `configureStore`, wraps app with `Provider`, `BrowserRouter`, and `Toaster`.
- Route configuration: `src/App.jsx` uses React Router `Routes` and `Route`. Public routes include `/`, `/about`, `/contact`, `courses/:courseId`, and `catalog/:catalogName`. Auth routes include `login`, `signup`, `verify-email`, `forgot-password`, and `update-password/:id`. Dashboard and view-course routes are private and role gated in JSX.
- Redux store and slices: `src/reducer/index.js`; slices are `src/slices/authSlice.js`, `profileSlice.js`, `courseSlice.js`, `cartSlice.js`, and `viewCourseSlice.js`.
- API service layer: `src/services/apiConnector.js`, `src/services/apis.js`, and operation modules under `src/services/operations/`.
- Pages: `src/pages/About.jsx`, `Catalog.jsx`, `Contact.jsx`, `CourseDetails.jsx`, `Dashboard.jsx`, `Error.jsx`, `ForgotPassword.jsx`, `Home.jsx`, `Login.jsx`, `Signup.jsx`, `UpdatePassword.jsx`, `VerifyEmail.jsx`, `ViewCourse.jsx`.
- Shared components: `src/components/Common/`.
- Feature components: `src/components/core/` grouped by AboutPage, Auth, Catalog, ContactUsPage, Course, Dashboard, HomePage, and ViewCourse.
- Hooks: `src/hooks/useOnClickOutside.js`, `src/hooks/useRouteMatch.js`.
- Utilities: `src/utils/avgRating.js`, `constants.js`, `dateFormatter.js`; also `src/services/formatDate.js`.
- Assets: `src/assets/Images/`, `src/assets/Logo/`, `src/assets/TimeLineLogo/`; static public files in `public/`.

## Current backend architecture

- Entry point: `server/index.js`.
- Route groups: `server/routes/user.js`, `profile.js`, `Course.js`, `Payments.js`, `Contact.js`.
- Controllers: `server/controllers/Auth.js`, `resetPassword.js`, `profile.js`, `Course.js`, `Category.js`, `Section.js`, `Subsection.js`, `courseProgress.js`, `RatingandReview.js`, `payments.js`, `ContactUs.js`.
- Models: `server/models/`.
- Middleware: `server/middleware/auth.js`.
- Configuration: `server/config/database.js`, `cloudinary.js`, `razorpay.js`.
- Utilities: `server/utils/imageUploader.js`, `mailSender.js`, `secToDuration.js`.
- Email templates: `server/mail/templates/contactFormRes.js`, `courseEnrollmentEmail.js`, `emailVerificationTemplate.js`, `passwordUpdate.js`, `paymentSuccessEmail.js`.

## Current data models

- `user`: identity, email/password, `accountType`, `active`, `approved`, profile reference, course references, reset token fields, display image, course progress references.
- `Profile`: gender, date of birth, about, contact number; referenced by `user.additionalDetails`.
- `Course`: course metadata, instructor reference, section references, rating/review references, price, thumbnail, category reference, enrolled student references, instructions, status, created date.
- `Category`: name, description, course references.
- `Section`: section name and subsection references.
- `SubSection`: title, duration, description, video URL.
- `courseProgress`: course reference, user reference, completed subsection references.
- `OTP`: email, OTP, created date with 5-minute TTL; pre-save hook sends verification email.
- `RatingAndReview`: user reference, rating, review, course reference.

## Current API groups

- `/api/v1/auth`: login, signup, OTP, change password, password reset token, password reset.
- `/api/v1/profile`: profile read/update/delete, display picture upload, enrolled courses, instructor dashboard.
- `/api/v1/course`: course CRUD, category create/list/page data, section/subsection CRUD, full course details, course progress update, ratings/reviews.
- `/api/v1/payment`: payment capture, payment verification, payment success email.
- `/api/v1/reach`: contact form submission.

## Existing engineering concerns

- Confirmed: frontend has both `dashboard/Settings` and `dashboard/settings` routes pointing to the same settings page.
- Confirmed: backend `DELETE /api/v1/course/deleteCourse` route is not protected by `auth` or `isInstructor` in `server/routes/Course.js`, although the frontend sends an Authorization header.
- Confirmed: real `.env` files exist locally at root and `server/.env`; they are not tracked by Git based on `git ls-files`.
- Confirmed: `server/.env.example` omits several env vars referenced by source, including Cloudinary, Razorpay, Resend, folder name, and port variables.
- Confirmed: root frontend `.env.example` was not found.
- Confirmed: `server/config/database.js` logs the MongoDB URL variable at startup, which may expose sensitive connection data in logs.
- Confirmed: several controllers log request bodies, OTP data, user details, course objects, payment objects, and upload options.
- Confirmed: response shape is inconsistent across controllers, including `data`, `updatedCourse`, `message`, `error`, and plain `courses` payloads.
- Confirmed: controller files contain business logic directly rather than service-layer separation.
- Confirmed: instructor approval logic appears faulty in signup because `approved` is initialized to an empty string before comparing with `"Instructor"`.
- Confirmed: model/field naming has inconsistencies such as `studentsEnroled`, model name `user`, and model name `courseProgress`.
- Confirmed: `Course.getAllCourses` selects `studentsEnrolled`, while the model field is `studentsEnroled`.
- Confirmed: course, section, and profile deletion remove database records but no Cloudinary media cleanup was found.
- Confirmed: contact controller sends a notification email to a hardcoded recipient address.
- Likely: complex Redux state and operation thunks will make future migration to TanStack Query/Auth Context non-trivial.
- Likely: cart and Razorpay payment flow add cross-cutting complexity to enrollment.
- Likely: frontend Razorpay key access via `process.env.RAZORPAY_KEY` will not work in CRA unless exposed with an allowed `REACT_APP_` prefix.
- Requires runtime verification: route guards, role-based access, checkout, free enrollment, course playback, and progress persistence.
- Requires runtime verification: OTP expiry, duplicate review handling, upload validation, and password reset link flow.

## Baseline limitations

This document reflects static source inspection only. Runtime verification has not been performed in this phase, so startup behavior, browser behavior, API responses, database connectivity, email delivery, media upload behavior, and Razorpay checkout behavior must be manually verified before treating them as operationally confirmed.
