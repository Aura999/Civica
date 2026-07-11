# STATE OWNERSHIP MODEL

## Final owners

### TanStack Query owns

- Course lists
- Course details
- Categories
- Enrollments
- Progress
- Reviews
- Profile data
- Instructor analytics
- Admin analytics
- AI conversation data if persisted by the backend

### Auth Context owns

- Current user
- Authentication status
- Initial session loading
- Login
- Logout
- Role checks
- Session restoration

### React Hook Form owns

- Login form
- Signup form
- Profile form
- Course metadata form
- Lesson form
- Review form
- Contact form

### Local state owns

- Modal open state
- Dropdown open state
- Selected tab
- Sidebar visibility
- Preview state
- Temporary UI toggles

### URL state owns

- Search query
- Category
- Page
- Sort
- Course ID
- Lesson ID
- Dashboard subsection where appropriate

### Backend persistence owns

- Course drafts
- Enrollment
- Progress
- Last-accessed lesson
- Published state
- Review state
- Instructor approval
- AI document chunks

## Redux migration table

| Current slice | Current field/action | Current purpose | Future owner | Migration note |
|---|---|---|---|---|
| `authSlice` | `signupData` | Carries signup data into OTP page | React Hook Form + short-lived backend OTP/session flow or URL-safe state | Avoid long-lived global signup payload |
| `authSlice` | `loading` | Auth request loading | TanStack mutation state/local form state | Remove global auth loading |
| `authSlice` | `token` | Session token from localStorage | Auth Context | Context restores session through `/api/auth/session` |
| `authSlice` | `setSignupData` | Store signup form data | Remove | Use form submit + OTP flow |
| `authSlice` | `setLoading` | Toggle loading | Remove | Query/mutation status |
| `authSlice` | `setToken` | Store token | Auth Context action | Centralize token/session |
| `profileSlice` | `user` | Current user profile | Auth Context for identity, TanStack Query for profile | Split session identity from editable profile |
| `profileSlice` | `loading` | Profile loading | TanStack Query | Remove |
| `profileSlice` | `setUser` | Store user | Auth Context/query cache update | No direct Redux |
| `profileSlice` | `setLoading` | Toggle loading | Remove | Query state |
| `courseSlice` | `step` | Course editor wizard step | URL state or local editor state | Prefer `?step=` for resumability |
| `courseSlice` | `course` | Draft/current course object | Backend-persisted draft + TanStack Query | Never keep full draft only in global frontend state |
| `courseSlice` | `editCourse` | Editor mode flag | Route + query data | Derived from route and course status |
| `courseSlice` | `paymentLoading` | Checkout loading | Remove with Razorpay | Free enrollment mutation status replaces it |
| `courseSlice` | `setStep` | Wizard navigation | URL/local state | Remove Redux |
| `courseSlice` | `setCourse` | Store course draft/server data | Query cache | Persist backend draft |
| `courseSlice` | `setEditCourse` | Toggle edit mode | Route-derived | Remove |
| `courseSlice` | `setPaymentLoading` | Payment UI state | Remove | Free enrollment mutation |
| `courseSlice` | `resetCourseState` | Clear editor state | Query invalidation/local cleanup | Remove |
| `cartSlice` | `cart` | Selected paid courses | Removed | Free enrollment has no cart |
| `cartSlice` | `total` | Cart price total | Removed | Pricing removed |
| `cartSlice` | `totalItems` | Cart count | Removed | No cart badge |
| `cartSlice` | `addToCart` | Add paid course | Removed | Use enroll mutation |
| `cartSlice` | `removeFromCart` | Remove paid course | Removed | No cart |
| `cartSlice` | `resetCart` | Clear after checkout/logout | Removed | No cart |
| `viewCourseSlice` | `courseSectionData` | Course content for player | TanStack Query | `useCourseContent(courseId)` |
| `viewCourseSlice` | `courseEntireData` | Full course data for player/review | TanStack Query | Split content/detail/enrollment queries |
| `viewCourseSlice` | `completedLectures` | Progress list | TanStack Query | `useProgress(courseId)` |
| `viewCourseSlice` | `totalNoOfLectures` | Derived count | Derived selector/local memo | Calculate from content query |
| `viewCourseSlice` | `setCourseSectionData` | Store content | Remove | Query cache |
| `viewCourseSlice` | `setEntireCourseData` | Store course | Remove | Query cache |
| `viewCourseSlice` | `setCompletedLectures` | Store progress | Remove | Query cache |
| `viewCourseSlice` | `updateCompletedLectures` | Optimistic completion | TanStack mutation optimistic update | Roll back on mutation failure |

## State rules

- Do not duplicate backend entities in local/global state.
- Do not store route identity in React state when URL params can own it.
- Do not store full course drafts in global frontend state.
- Do not use Context as a replacement Redux store.
- Query invalidation must follow mutations that change courses, enrollment, progress, reviews, profile, or analytics.
