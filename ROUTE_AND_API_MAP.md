# ROUTE AND API MAP

Phase 1 static audit. Verification status is static source verified unless noted.

## Frontend routing

Routes are defined in `src/App.jsx` under a global `Navbar`.

| URL path | Component rendered | Public/protected | Allowed roles | Parent layout | Nested routes | Redirect behavior | Redux dependency | API dependency | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `/` | `Home` | Public | All | App shell | None | None | None direct | `ReviewSlider` fetches reviews | Landing page |
| `/about` | `About` | Public | All | App shell | None | None | None direct | `ReviewSlider`, contact form section | About page |
| `/contact` | `Contact` | Public | All | App shell | None | None | None direct | contact submit, reviews | Contact page |
| `courses/:courseId` | `CourseDetails` | Public with auth-sensitive CTAs | All | App shell | None | None | `profile.user`, `auth.token`, `profile.loading`, `course.paymentLoading` | `getCourseDetails`, cart/payment operations | Course purchase/enrollment decision path |
| `catalog/:catalogName` | `Catalog` | Public | All | App shell | None | None | `profile.loading` | category list, category page data | Uses path name to find category |
| `login` | `OpenRoute > Login` | Public-only | Anonymous | App shell | None | `OpenRoute` redirects authenticated user | `auth.token`, `auth.loading` | login | Auth page |
| `forgot-password` | `OpenRoute > ForgotPassword` | Public-only | Anonymous | App shell | None | `OpenRoute` redirects authenticated user | `auth.loading` | reset token | Auth page |
| `update-password/:id` | `OpenRoute > UpdatePassword` | Public-only | Anonymous | App shell | None | `OpenRoute` redirects authenticated user | `auth.loading` | reset password | Token in URL |
| `signup` | `OpenRoute > Signup` | Public-only | Anonymous | App shell | None | `OpenRoute` redirects authenticated user | `auth.signupData`, `auth.loading` indirectly | send OTP | Auth page |
| `verify-email` | `OpenRoute > VerifyEmail` | Public-only | Anonymous with `signupData` | App shell | None | redirects to `/signup` when signup data missing | `auth.signupData`, `auth.loading` | signup | OTP page |
| `dashboard/my-profile` | `PrivateRoute > Dashboard > MyProfile` | Protected | Any authenticated role | `Dashboard` | Outlet child | `PrivateRoute` redirects missing token to `/login` | `profile.user`, auth/profile loading | user details loaded by App | Profile page |
| `dashboard/Settings` | `PrivateRoute > Dashboard > Settings` | Protected | Any authenticated role | `Dashboard` | Outlet child | Same as above | auth/profile | settings APIs | Duplicate/inconsistent casing |
| `dashboard/settings` | `PrivateRoute > Dashboard > Settings` | Protected | Any authenticated role | `Dashboard` | Outlet child | Same as above | auth/profile | settings APIs | Duplicate route, lower-case |
| `dashboard/instructor` | `Dashboard > Instructor` | Protected | Instructor only, conditional route registration | `Dashboard` | Outlet child | Missing route if user role not loaded/mismatch | `profile.user`, `auth.token` | instructor dashboard | Role route exists only after user available |
| `dashboard/my-courses` | `Dashboard > MyCourses` | Protected | Instructor only | `Dashboard` | Outlet child | Same conditional concern | `auth.token` | instructor courses | Instructor course table |
| `dashboard/add-course` | `Dashboard > AddCourse` | Protected | Instructor only | `Dashboard` | Outlet child | Same conditional concern | `auth.token`, `course` slice | course/category/section/subsection APIs | Multi-step builder |
| `dashboard/edit-course/:courseId` | `Dashboard > EditCourse` | Protected | Instructor only | `Dashboard` | Outlet child | Same conditional concern | `auth.token`, `course` slice | full course details, edit APIs | Depends on route param |
| `/dashboard/cart` | `Dashboard > Cart` | Protected | Student only | `Dashboard` | Outlet child | Same conditional concern | `cart`, `course.paymentLoading` | payment APIs | Absolute path nested under dashboard |
| `dashboard/enrolled-courses` | `Dashboard > EnrolledCourses` | Protected | Student only | `Dashboard` | Outlet child | Same conditional concern | `auth.token` | get enrolled courses | Student list |
| `view-course/:courseId/section/:sectionId/sub-section/:subSectionId` | `PrivateRoute > ViewCourse > VideoDetails` | Protected | Student only | `ViewCourse` | Outlet child | Missing route if user role not loaded/mismatch | `auth.token`, `viewCourse` | full course details, mark complete | Player route |
| `*` | `Error` | Public fallback | All | App shell | None | None | None | None | 404 |

### Frontend route concerns

| Issue | Evidence | Severity | Confidence | Recommended future action |
|---|---|---|---|---|
| Duplicate settings routes with casing mismatch | `dashboard/Settings` and `dashboard/settings` both render `Settings` | Medium | Confirmed | Merge |
| Conditional route registration by loaded user role can make role routes temporarily absent | Instructor/student routes rendered only when `user?.accountType` matches | High | Likely | Rewrite route guards |
| Nested cart route uses absolute path | `/dashboard/cart` inside dashboard route | Low | Confirmed | Normalize routes |
| Global `App` fetches user details and owns auth rehydration | `App.jsx` dispatches `getUserDetails` from token | High | Confirmed | Move to Auth Context |
| Server state is mixed with route state | course details, player data, enrolled courses, dashboard data use Redux/local state | High | Confirmed | TanStack Query |

## Backend API routing

Base path from `server/index.js`: `/api/v1`.

### Authentication

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/auth/login` | `server/routes/user.js` | None | `login` | Public | `user`, `Profile` | JWT, bcrypt | `login` in `authAPI.js` | Static verified |
| POST | `/api/v1/auth/signup` | `server/routes/user.js` | None | `signup` | Public | `user`, `Profile`, `OTP` | bcrypt | `signUp` in `authAPI.js` | Static verified |
| POST | `/api/v1/auth/sendotp` | `server/routes/user.js` | None | `sendotp` | Public | `user`, `OTP` | otp-generator, email via OTP model | `sendOtp` in `authAPI.js` | Static verified |
| POST | `/api/v1/auth/changepassword` | `server/routes/user.js` | `auth` | `changePassword` | Authenticated | `user` | bcrypt, email | `changePassword` in `SettingsAPI.js` | Static verified |
| POST | `/api/v1/auth/reset-password-token` | `server/routes/user.js` | None | `resetPasswordToken` | Public | `user` | crypto token, email | `getPasswordResetToken` | Static verified |
| POST | `/api/v1/auth/reset-password` | `server/routes/user.js` | None | `resetPassword` | Public | `user` | bcrypt | `resetPassword` | Static verified |

### Profile

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| DELETE | `/api/v1/profile/deleteProfile` | `server/routes/profile.js` | `auth` | `deleteAccount` | Authenticated | `user`, `Profile`, `Course`, `CourseProgress` | None | `deleteProfile` | Static verified |
| PUT | `/api/v1/profile/updateProfile` | `server/routes/profile.js` | `auth` | `updateProfile` | Authenticated | `user`, `Profile` | None | `updateProfile` | Static verified |
| GET | `/api/v1/profile/getUserDetails` | `server/routes/profile.js` | `auth` | `getAllUserDetails` | Authenticated | `user`, `Profile` | None | `getUserDetails` | Static verified |
| GET | `/api/v1/profile/getEnrolledCourses` | `server/routes/profile.js` | `auth` | `getEnrolledCourses` | Authenticated | `user`, `Course`, `Section`, `SubSection`, `CourseProgress` | None | `getUserEnrolledCourses` | Static verified |
| PUT | `/api/v1/profile/updateDisplayPicture` | `server/routes/profile.js` | `auth` | `updateDisplayPicture` | Authenticated | `user` | Cloudinary | `updateDisplayPicture` | Static verified |
| GET | `/api/v1/profile/instructorDashboard` | `server/routes/profile.js` | `auth`, `isInstructor` | `instructorDashboard` | Instructor | `Course` | None | `getInstructorData` | Static verified |

### Courses

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/createCourse` | `server/routes/Course.js` | `auth`, `isInstructor` | `createCourse` | Instructor | `Course`, `Category`, `user` | Cloudinary | `addCourseDetails` | Static verified |
| POST | `/api/v1/course/editCourse` | `server/routes/Course.js` | `auth`, `isInstructor` | `editCourse` | Instructor | `Course` | Cloudinary if thumbnail | `editCourseDetails` | Static verified |
| GET | `/api/v1/course/getInstructorCourses` | `server/routes/Course.js` | `auth`, `isInstructor` | `getInstructorCourses` | Instructor | `Course` | None | `fetchInstructorCourses` | Static verified |
| GET | `/api/v1/course/getAllCourses` | `server/routes/Course.js` | None | `getAllCourses` | Public | `Course`, `user` | None | `getAllCourses` | Static verified |
| POST | `/api/v1/course/getCourseDetails` | `server/routes/Course.js` | None | `getCourseDetails` | Public | `Course`, `user`, `Profile`, `Category`, `RatingAndReview`, `Section`, `SubSection` | None | `fetchCourseDetails` | Static verified |
| POST | `/api/v1/course/getFullCourseDetails` | `server/routes/Course.js` | `auth` | `getFullCourseDetails` | Authenticated | `Course`, `CourseProgress`, related course models | None | `getFullDetailsOfCourse` | Static verified |
| DELETE | `/api/v1/course/deleteCourse` | `server/routes/Course.js` | None | `deleteCourse` | Unprotected in backend route | `Course`, `user`, `Section`, `SubSection` | None | `deleteCourse` sends token but backend does not require it | Static verified, security concern |

### Sections

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/addSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `createSection` | Instructor | `Section`, `Course` | None | `createSection` | Static verified |
| POST | `/api/v1/course/updateSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `updateSection` | Instructor | `Section`, `Course` | None | `updateSection` | Static verified |
| POST | `/api/v1/course/deleteSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `deleteSection` | Instructor | `Section`, `Course`, `SubSection` | None | `deleteSection` | Static verified |

### Subsections

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/addSubSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `createSubSection` | Instructor | `SubSection`, `Section` | Cloudinary video upload | `createSubSection` | Static verified |
| POST | `/api/v1/course/updateSubSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `updateSubSection` | Instructor | `SubSection`, `Section` | Cloudinary if video | `updateSubSection` | Static verified |
| POST | `/api/v1/course/deleteSubSection` | `server/routes/Course.js` | `auth`, `isInstructor` | `deleteSubSection` | Instructor | `SubSection`, `Section` | None | `deleteSubSection` | Static verified |

### Categories

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/createCategory` | `server/routes/Course.js` | `auth`, `isAdmin` | `createCategory` | Admin | `Category` | None | No confirmed frontend caller | Static verified |
| GET | `/api/v1/course/showAllCategories` | `server/routes/Course.js` | None | `showAllCategories` | Public | `Category` | None | `fetchCourseCategories`, `Navbar`, `Catalog` | Static verified |
| POST | `/api/v1/course/getCategoryPageDetails` | `server/routes/Course.js` | None | `categoryPageDetails` | Public | `Category`, `Course`, `RatingAndReview` | None | `getCatalogPageData` | Static verified |

### Reviews

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/createRating` | `server/routes/Course.js` | `auth`, `isStudent` | `createRating` | Student | `RatingAndReview`, `Course` | None | `createRating` | Static verified |
| GET | `/api/v1/course/getAverageRating` | `server/routes/Course.js` | None | `getAverageRating` | Public | `RatingAndReview` | None | No confirmed endpoint constant | Static verified |
| GET | `/api/v1/course/getReviews` | `server/routes/Course.js` | None | `getAllRatingReview` | Public | `RatingAndReview`, `user`, `Course` | None | `ReviewSlider` through `REVIEWS_DETAILS_API` | Static verified |

### Progress

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/course/updateCourseProgress` | `server/routes/Course.js` | `auth`, `isStudent` | `updateCourseProgress` | Student | `CourseProgress`, `SubSection` | None | `markLectureAsComplete` | Static verified |
| POST | `/api/v1/course/getProgressPercentage` | `server/routes/Course.js` | Commented out | `getProgressPercentage` commented | Student intended | `CourseProgress` | None | No active caller | Dead/commented |

### Payments

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/payment/capturePayment` | `server/routes/Payments.js` | `auth`, `isStudent` | `capturePayment` | Student | `Course`, `user`, `CourseProgress` through free path | Razorpay, enrollment | `BuyCourse` | Static verified |
| POST | `/api/v1/payment/verifyPayment` | `server/routes/Payments.js` | `auth`, `isStudent` | `verifyPayment` | Student | `Course`, `user`, `CourseProgress` | Razorpay signature, enrollment, email | internal `verifyPayment` in `studentFeaturesAPI.js` | Static verified |
| POST | `/api/v1/payment/sendPaymentSuccessEmail` | `server/routes/Payments.js` | `auth`, `isStudent` | `sendPaymentSuccessEmail` | Student | `user` | Email | internal `sendPaymentSuccessEmail` | Static verified |

### Contact

| Method | Full path | Route file | Middleware | Controller | Roles | Main models | Integrations | Frontend caller | Verification |
|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/reach/contact` | `server/routes/Contact.js` | None | `contactUsController` | Public | None | Email | `ContactUsForm` | Static verified |
