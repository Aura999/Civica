# FRONTEND DEPENDENCY MAP

Phase 1 static audit. This file documents current dependencies and migration pressure points without implementing changes.

## Feature dependency graph

| Feature | Route | Page | Feature components | Shared components | Redux slices | API functions | Hooks/utilities | Assets | Backend endpoints |
|---|---|---|---|---|---|---|---|---|---|
| Authentication | `login`, `signup`, `verify-email`, `forgot-password`, `update-password/:id` | `Login`, `Signup`, `VerifyEmail`, `ForgotPassword`, `UpdatePassword` | `LoginForm`, `SignupForm`, `Template`, `OpenRoute`, `PrivateRoute`, `ProfileDropdown` | `Navbar`, `IconBtn`, `Tab` | `auth`, `profile`, `cart` on logout | `sendOtp`, `signUp`, `login`, `getPasswordResetToken`, `resetPassword`, `logout`, `getUserDetails` | `ACCOUNT_TYPE` | login/signup images | `/auth/*`, `/profile/getUserDetails` |
| Catalog | `catalog/:catalogName` | `Catalog` | `Course_Card`, `Course_Slider` | `Navbar`, `Footer`, `RatingStars` | `profile.loading` | `getCatalogPageData`; direct `apiConnector` category call | `GetAvgRating` | course thumbnails from API | `/course/showAllCategories`, `/course/getCategoryPageDetails` |
| Course details | `courses/:courseId` | `CourseDetails` | `CourseAccordionBar`, `CourseSubSectionAccordion`, `CourseDetailsCard` | `ConfirmationModal`, `RatingStars`, `IconBtn` | `auth`, `profile`, `course.paymentLoading`, `cart` through card actions | `fetchCourseDetails`, `BuyCourse`, cart actions | `formatDate`, `GetAvgRating`, `ReactMarkdown` | Razorpay logo via checkout path | `/course/getCourseDetails`, `/payment/*` |
| Cart | `/dashboard/cart` | `Dashboard` child | `Cart`, `RenderCartCourses`, `RenderTotalAmount` | `IconBtn` | `cart`, `course.paymentLoading`, `auth`, `profile` | `BuyCourse` | None | `rzp_logo.png` | `/payment/capturePayment`, `/payment/verifyPayment`, `/payment/sendPaymentSuccessEmail` |
| Checkout | Course details/cart actions | N/A | `CourseDetailsCard`, `RenderTotalAmount` | `ConfirmationModal` | `cart`, `course.paymentLoading`, `auth`, `profile` | `BuyCourse` | dynamic Razorpay script loader | Razorpay logo | `/payment/*` |
| Course creation | `dashboard/add-course` | `Dashboard` child | `AddCourse`, `RenderSteps`, `CourseInformationForm`, `Upload`, `ChipInput`, `RequirementsField`, `PublishCourse` | `IconBtn` | `auth`, `course` | `fetchCourseCategories`, `addCourseDetails`, `editCourseDetails` | React Hook Form | upload preview from local file/API | `/course/createCourse`, `/course/editCourse`, `/course/showAllCategories` |
| Section and lesson builder | `dashboard/add-course`, `dashboard/edit-course/:courseId` | `Dashboard` child | `CourseBuilderForm`, `NestedView`, `SubSectionModal` | `ConfirmationModal`, `IconBtn` | `auth`, `course` | `createSection`, `updateSection`, `deleteSection`, `createSubSection`, `updateSubSection`, `deleteSubSection` | React Hook Form | video upload preview data | `/course/*Section` |
| Instructor dashboard | `dashboard/instructor` | `Dashboard` child | `Instructor`, `InstructorChart` | Sidebar/table UI | `auth`, `profile` | `getInstructorData` | Chart.js | API thumbnails | `/profile/instructorDashboard` |
| Student enrolled courses | `dashboard/enrolled-courses` | `Dashboard` child | `EnrolledCourses` | progress bar dependency | `auth` | `getUserEnrolledCourses` | `secToDuration` equivalent comes from backend | API thumbnails | `/profile/getEnrolledCourses` |
| Course player | `view-course/:courseId/...` | `ViewCourse` | `VideoDetails`, `VideoDetailsSidebar`, `CourseReviewModal` | `IconBtn`, modal controls | `auth`, `viewCourse`, `profile` | `getFullDetailsOfCourse`, `markLectureAsComplete`, `createRating` | `useParams`, React Hook Form | video URL from Cloudinary | `/course/getFullCourseDetails`, `/course/updateCourseProgress`, `/course/createRating` |
| Progress tracking | Player route | `ViewCourse` | `VideoDetails`, `VideoDetailsSidebar` | None major | `viewCourse` | `markLectureAsComplete`, full details fetch | route params | None | `/course/updateCourseProgress`, `/course/getFullCourseDetails` |
| Reviews | Home/about/contact, player modal | `Home`, `About`, `Contact`, `ViewCourse` | `CourseReviewModal` | `ReviewSlider`, `RatingStars` | `viewCourse`, `profile`, `auth` | `createRating`; direct `apiConnector` in `ReviewSlider` | React Hook Form | user/course image URLs | `/course/createRating`, `/course/getReviews` |
| Profile settings | `dashboard/settings` | `Dashboard` child | `Settings`, `EditProfile`, `ChangeProfilePicture`, `UpdatePassword`, `DeleteAccount` | `IconBtn` | `auth`, `profile` | `updateProfile`, `updateDisplayPicture`, `changePassword`, `deleteProfile` | React Hook Form | display image | `/profile/*`, `/auth/changepassword` |
| Contact form | `/contact`, about contact section | `Contact`, `About` | `ContactForm`, `ContactUsForm`, `ContactDetails` | `Footer` | None | direct `apiConnector` | React Hook Form | country code data | `/reach/contact` |

## Direct API calls outside operation modules

| File | API usage | Severity | Confidence | Future action |
|---|---|---|---|---|
| `src/pages/Catalog.jsx` | Direct `apiConnector("GET", categories.CATEGORIES_API)` | Medium | Confirmed | Move into query hook |
| `src/components/Common/Navbar.jsx` | Direct category fetch with `apiConnector` | Medium | Confirmed | Move into query hook/shared category service |
| `src/components/Common/ReviewSlider.jsx` | Direct reviews fetch | Low | Confirmed | Move into query hook |
| `src/components/core/ContactUsPage/ContactUsForm.jsx` | Direct contact submit | Low | Confirmed | Move into mutation hook |

## Components and files over 250 lines

| File | Lines observed | Concern | Severity | Confidence | Future action |
|---|---:|---|---|---|---|
| `src/components/Common/Navbar.jsx` | 279 | Fetching, responsive menu, auth/cart display, catalog dropdown in one component | Medium | Confirmed | Rewrite |
| `src/components/core/Dashboard/AddCourse/CourseInformation/CourseInformationForm.jsx` | 305 | Course fetch, edit-state comparison, form wiring, upload/category fields | High | Confirmed | Rewrite with RHF/Zod and feature services |
| `src/pages/CourseDetails.jsx` | 258 | Page fetch, derived course stats, enrollment/payment decisions, accordion UI | High | Confirmed | Split page, query, and CTA logic |
| `src/services/operations/courseDetailsAPI.js` | 367 | Many unrelated course, section, progress, rating operations in one file | High | Confirmed | Split by feature/domain |

## Frontend issues

| Issue | Evidence | Severity | Confidence | Recommended future action |
|---|---|---|---|---|
| Feature code scattered across pages, core components, services, slices, utils | Course details spans page, course components, cart slice, payment service, backend payment | High | Confirmed | Move |
| Server state stored in Redux | `profile.user`, `viewCourse.courseEntireData`, `viewCourse.completedLectures`, `course.course` | High | Confirmed | TanStack Query/Auth Context |
| Redux used for temporary wizard state | `course.step`, `course.editCourse` | Medium | Confirmed | Local state or route scoped form state |
| Cart persists purchasable course data in localStorage | `cartSlice` localStorage state | High | Confirmed | Remove |
| Payment loading in course slice couples cart/course editor concerns | `course.paymentLoading` used in cart/course details | Medium | Confirmed | Remove with Razorpay |
| Direct API calls bypass operation layer | Catalog, Navbar, ReviewSlider, ContactUsForm | Medium | Confirmed | Query/mutation hooks |
| Inconsistent loading/error handling | mix of local loading, Redux loading, toast-only errors, console logs | Medium | Confirmed | Standard query states |
| Duplicate contact form wrappers | `ContactForm`, `ContactFormSection`, `ContactUsForm` | Low | Confirmed | Merge |
| Duplicate settings routes | `dashboard/Settings` and `dashboard/settings` | Medium | Confirmed | Merge |
| Business logic inside UI components | enrollment checks in `CourseDetailsCard`, route role checks in `App`, section builder mutations in components | High | Confirmed | Move to hooks/services |
| Debug logging in UI | `CourseDetailsCard`, `Navbar`, operations modules | Low | Confirmed | Remove during cleanup |
| React Hook Form used without Zod validation | Forms use RHF, no Zod dependency/usage found | Medium | Confirmed | Add validation in future phase |
| API endpoint constants are string-concatenated with `BASE_URL` | `src/services/apis.js` | Low | Confirmed | Replace with typed client/query keys |

## Redux audit

### `authSlice`

- State shape: `{ signupData, loading, token }`.
- Actions: `setSignupData`, `setLoading`, `setToken`.
- Selectors: direct `useSelector((state) => state.auth)` usage.
- Consumers: `App`, `Navbar`, `PrivateRoute`, `OpenRoute`, auth pages/forms, dashboard, settings, cart, course builder, player.
- API functions mutating it: `sendOtp`, `login`, `getPasswordResetToken`, `resetPassword`, `logout`.
- Persistence: token initialized from `localStorage`; login writes token; logout removes token.
- State category: authentication state, signup navigation state, loading UI state.
- Future replacement: Auth Context for token/session; React Hook Form or route state for signup data; local/query loading.
- Risks: persisted token may be stale; `signupData` in Redux controls OTP flow and is lost on refresh.

### `profileSlice`

- State shape: `{ user, loading }`.
- Actions: `setUser`, `setLoading`.
- Consumers: `App`, `Navbar`, `Dashboard`, `Sidebar`, `MyProfile`, settings forms, course details/card, instructor dashboard, review modal.
- API functions mutating it: `getUserDetails`, `login`, `updateProfile`, `updateDisplayPicture`, `logout`.
- Persistence: no direct slice persistence; rehydrated from token via `getUserDetails`.
- State category: authentication user profile and server state.
- Future replacement: Auth Context for current user identity, TanStack Query for profile data.
- Risks: role-based routes depend on async user load; user data can become stale after backend updates.

### `courseSlice`

- State shape: `{ step, course, editCourse, paymentLoading }`.
- Actions: `setStep`, `setCourse`, `setEditCourse`, `setPaymentLoading`, `resetCourseState`.
- Consumers: add/edit course flow, course info fields, publish step, render steps, cart payment loading, course details payment loading.
- API functions mutating it: course builder functions dispatch after create/edit/section/subsection; payment flow dispatches payment loading.
- Persistence: none.
- State category: form/navigation/UI state plus server course data plus payment UI state.
- Future replacement: React Hook Form/local state for wizard; TanStack Query for course data; remove `paymentLoading`.
- Risks: one slice couples course editor and checkout; edit flow can hold stale course snapshot.

### `cartSlice`

- State shape: `{ cart, total, totalItems }`.
- Actions: `addToCart`, `removeFromCart`, `resetCart`.
- Consumers: `Navbar`, `Cart`, `RenderCartCourses`, `RenderTotalAmount`, course card/details purchase logic.
- API functions mutating it: `logout` resets cart; `BuyCourse` resets after payment verification.
- Persistence: `localStorage` for cart, total, totalItems.
- State category: client-only cart state holding server course snapshots.
- Future replacement: remove entirely for free enrollment.
- Risks: stale price/course data, duplicate source of truth, payment coupling.

### `viewCourseSlice`

- State shape: `{ courseSectionData, courseEntireData, completedLectures, totalNoOfLectures }`.
- Actions: `setCourseSectionData`, `setEntireCourseData`, `setTotalNoOfLectures`, `setCompletedLectures`, `updateCompletedLectures`.
- Consumers: `ViewCourse`, `VideoDetails`, `VideoDetailsSidebar`, `CourseReviewModal`.
- API functions mutating it: full course fetch in `ViewCourse`, mark complete flow updates completed lectures.
- Persistence: none.
- State category: server state plus route-scoped player UI/derived data.
- Future replacement: TanStack Query for full course/progress; local state for active video/sidebar.
- Risks: completed lecture state can diverge from backend after failed mutation or reload.

## Redux removal dependencies

1. Establish Auth Context and current-user query before changing route guards.
2. Replace course/player server data with TanStack Query before removing `viewCourse`.
3. Replace course editor wizard state with RHF/local state before removing `course`.
4. Remove cart/payment flows before deleting `cart`.
5. Normalize loading/error states to query/mutation status.
