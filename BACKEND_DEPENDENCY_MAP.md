# BACKEND DEPENDENCY MAP

Phase 1 static audit. No backend behavior was changed for this audit.

## Domain dependency graph

| Domain | Routes | Middleware | Controllers | Utilities | Models | External integration | Email template | Frontend caller |
|---|---|---|---|---|---|---|---|---|
| Authentication | `/api/v1/auth/login`, `/signup`, `/sendotp`, `/changepassword` | `auth` for change password | `Auth.js` | `mailSender` | `user`, `Profile`, `OTP` | JWT, bcrypt, OTP generator, email | `passwordUpdate`, OTP template through model | `authAPI.js`, settings |
| OTP | `/api/v1/auth/sendotp`, `/signup` | None | `Auth.sendotp`, `Auth.signup` | `mailSender` through model hook | `OTP`, `user` | Resend via mail utility | `emailVerificationTemplate` | `sendOtp`, `signUp` |
| Password reset | `/api/v1/auth/reset-password-token`, `/reset-password` | None | `resetPassword.js` | `mailSender` | `user` | crypto token, bcrypt, email | inline email body | auth pages |
| Profile | `/api/v1/profile/*` | `auth`, `isInstructor` | `profile.js` | `imageUploader`, `secToDuration` | `user`, `Profile`, `Course`, `CourseProgress` | Cloudinary for display picture | None | profile/settings/instructor/enrolled pages |
| Courses | `/api/v1/course/createCourse`, `/editCourse`, `/get*`, `/deleteCourse` | mixed: instructor for create/edit/list, none for delete | `Course.js` | `imageUploader`, `secToDuration` | `Course`, `Category`, `Section`, `SubSection`, `user`, `CourseProgress` | Cloudinary thumbnails | None | catalog/course details/editor |
| Sections | `/api/v1/course/addSection`, `/updateSection`, `/deleteSection` | `auth`, `isInstructor` | `Section.js` | None | `Section`, `Course`, `SubSection` | None | None | course builder |
| Subsections | `/api/v1/course/addSubSection`, `/updateSubSection`, `/deleteSubSection` | `auth`, `isInstructor` | `Subsection.js` | `imageUploader` | `SubSection`, `Section` | Cloudinary video uploads | None | lesson builder |
| Categories | `/api/v1/course/createCategory`, `/showAllCategories`, `/getCategoryPageDetails` | admin for create, none for reads | `Category.js` | None | `Category`, `Course`, `RatingAndReview` | None | None | navbar/catalog; no admin UI confirmed |
| Reviews | `/api/v1/course/createRating`, `/getAverageRating`, `/getReviews` | student for create, none for reads | `RatingandReview.js` | None | `RatingAndReview`, `Course` | None | None | review modal/slider |
| Progress | `/api/v1/course/updateCourseProgress` | `auth`, `isStudent` | `courseProgress.js` | None | `CourseProgress`, `SubSection` | None | None | player |
| Payments | `/api/v1/payment/*` | `auth`, `isStudent` | `payments.js` | `mailSender` | `Course`, `user`, `CourseProgress` | Razorpay, email | `paymentSuccessEmail`, `courseEnrollmentEmail` | checkout/cart |
| Contact | `/api/v1/reach/contact` | None | `ContactUs.js` | `mailSender` | None | Email | `contactFormRes` | contact form |

## Backend issues

| Issue | Evidence | Severity | Confidence | Future action |
|---|---|---|---|---|
| Controllers contain business logic and orchestration | `Course.js`, `payments.js`, `profile.js`, `Auth.js` perform validation, DB writes, external calls | High | Confirmed | Rewrite into services |
| Multi-model writes lack transactions | enrollment, delete account, delete course, section deletes | High | Confirmed | Add service transactions where supported |
| Payment and enrollment tightly coupled | `payments.js` creates progress, updates user/course, sends email | High | Confirmed | Replace with enrollment service |
| Missing backend auth on delete course | `router.delete("/deleteCourse", deleteCourse)` | Critical | Confirmed | Add role/ownership check in future fix phase |
| Missing ownership checks | instructor section/subsection/course updates rely on role, not confirmed course ownership | High | Confirmed | Add ownership middleware/service checks |
| Missing validation middleware | controllers manually check fields; no schema validation layer | High | Confirmed | Add validation middleware |
| Inconsistent response shapes/status codes | `data`, `updatedCourse`, `courses`, 200 for errors, 400/500 mixed | Medium | Confirmed | Central response/error policy |
| Direct Cloudinary calls in controllers via utility | Course/subsection/profile upload during controller execution | Medium | Confirmed | Move to media service |
| Direct email calls in model/controller | OTP pre-save hook sends email; Auth/payments/contact controllers send email | High | Confirmed | Move to async email service |
| Model side effect | `OTP` pre-save sends email | High | Confirmed | Remove side effect later |
| Delete operations lack media cleanup | course/section/subsection/profile image deletes do not delete Cloudinary assets | High | Confirmed | Store public IDs and cleanup |
| Security-sensitive logging remains | auth middleware logs decoded token/user; controllers log OTP/request/payment/user/upload details | High | Confirmed | Remove logs |
| Inconsistent naming | `studentsEnroled`, `Subsection.js` vs `SubSection`, model `user`, service typo `pageAndComponntDatas` | Medium | Confirmed | Normalize during migration |
| Long controller files | `Course.js` 455, `Auth.js` 273, `profile.js` 222, `payments.js` 191 lines | Medium | Confirmed | Split by service/module |
| Dead/commented route/controller paths | `getProgressPercentage`, `verifySignature`, old course details, old Nodemailer code | Low | Confirmed | Remove after verification |
| Admin backend exists without confirmed frontend surface | `isAdmin`, `createCategory`; no admin route in `App.jsx` | Medium | Confirmed | Verify product requirement |
| Hardcoded contact notification recipient | `ContactUs.js` sends to fixed address | Medium | Confirmed | Move to env/config |
| Password reset URL is hardcoded | `resetPassword.js` uses deployed URL literal | Medium | Confirmed | Move to env/config |
| Root package contains backend-only dependencies | root manifest includes Express/Mongoose/Razorpay/etc. | Medium | Confirmed | Clean manifest during Vite migration |

## Code paths affected by removing Razorpay

- Frontend:
  - `src/services/operations/studentFeaturesAPI.js`
  - `src/components/core/Dashboard/Cart/*`
  - `src/slices/cartSlice.js`
  - `src/components/core/Course/CourseDetailsCard.jsx`
  - `src/pages/CourseDetails.jsx`
  - `src/assets/Logo/rzp_logo.png`
  - `src/services/apis.js` payment endpoints
- Backend:
  - `server/routes/Payments.js`
  - `server/controllers/payments.js`
  - `server/config/razorpay.js`
  - `server/mail/templates/paymentSuccessEmail.js`
  - `server/index.js` payment route registration
  - Razorpay env vars and dependency
- Data:
  - Enrollment currently occurs in payment controller, so an enrollment service/API must replace it before removing payment.

## Functions over 100 lines or high complexity

| File | Function/file concern | Future action |
|---|---|---|
| `server/controllers/Course.js` | Course create/edit/read/delete plus population and duration logic | Split into course service/read service/content service |
| `server/controllers/Auth.js` | Signup, login, OTP, password change in one controller | Split auth, OTP, password services |
| `server/controllers/profile.js` | Profile update/delete/enrolled courses/dashboard | Split profile, enrollment read, instructor analytics |
| `server/controllers/payments.js` | Payment capture/verify/email/enrollment | Replace with enrollment service and remove payment |
| `server/controllers/Section.js` | Section CRUD with cascading subsection delete | Move to content service |
| `server/controllers/Subsection.js` | Subsection CRUD plus media upload | Move to content/media services |
| `server/controllers/RatingandReview.js` | Review create/list/aggregate | Move to review service |
| `server/controllers/Category.js` | Category page aggregation/recommendations | Move to catalog service |
