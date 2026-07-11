# FINAL PRODUCT SCOPE

Product name: **CIVICA — AI-Enabled Civic and Life-Skills Learning Platform**

Positioning: CIVICA is a free, role-based learning platform where volunteer instructors publish structured multimedia civic and life-skills courses, underserved learners enroll freely, track lesson-level progress, and use a course-specific AI assistant grounded in approved learning resources.

## Product purpose

| Category | Decision |
|---|---|
| Target users | Underserved learners, volunteer instructors, and platform admins. |
| Core problem | Learners need structured civic and life-skills education without cost barriers, while volunteers need a simple way to publish trusted course material. |
| Value proposition | Free access, role-based course authoring, lesson progress, multimedia resources, and course-scoped AI help grounded in approved materials. |
| Not a generic marketplace | CIVICA does not optimize for sales, pricing, coupons, revenue analytics, or instructor monetization. It optimizes for access, trusted learning, and progress. |
| Why free enrollment replaces payments | Payment introduces friction and contradicts the underserved learner mission. Free enrollment also removes cart, Razorpay, payment verification, and revenue complexity. |
| Why course-specific AI | A generic assistant risks vague or unsupported answers. Course-specific RAG limits retrieval to approved resources for that course, gives citations, and prevents cross-course leakage. |

## User roles

### Public visitor

| Capability | Priority |
|---|---|
| View landing page | Must have |
| View About page | Must have |
| View Contact page | Must have |
| Browse published courses | Must have |
| Search and filter courses | Must have |
| View course details | Must have |
| Register | Must have |
| Login | Must have |

### Student

| Capability | Priority |
|---|---|
| Register and verify email | Must have |
| Login and logout | Must have |
| Browse published courses | Must have |
| Enroll for free | Must have |
| View enrolled courses | Must have |
| Open authorized course content | Must have |
| Watch videos | Must have |
| View PDFs and images | Should have |
| Navigate sections and lessons | Must have |
| Mark lessons complete | Must have |
| Track progress | Must have |
| Continue from last-accessed lesson | Should have |
| Ask questions using the course-specific AI assistant | Must have |
| Submit one review per enrolled course | Must have |
| Edit or delete own review | Should have |
| Manage profile | Must have |
| Change password | Must have |
| Delete account | Should have |

### Instructor

| Capability | Priority |
|---|---|
| Register as Instructor | Must have |
| Remain pending until Admin approval | Must have |
| Login after approval | Must have |
| Create course drafts | Must have |
| Edit owned courses | Must have |
| Delete owned courses | Should have |
| Add course metadata | Must have |
| Upload thumbnails | Must have |
| Create sections | Must have |
| Create lessons | Must have |
| Upload videos, PDFs, and images | Must have |
| Reorder sections and lessons if feasible | Should have |
| Preview courses | Must have |
| Publish courses | Must have |
| Unpublish courses | Should have |
| View owned courses | Must have |
| View enrollment counts | Should have |
| View basic completion analytics | Should have |
| Manage profile | Must have |

### Admin

| Capability | Priority |
|---|---|
| Approve or reject Instructor accounts | Must have |
| Manage users | Must have |
| Manage categories | Must have |
| Moderate courses | Must have |
| Publish, unpublish, or remove inappropriate courses | Must have |
| View platform-level counts | Should have |
| View pending approvals | Must have |
| Manage profile | Must have |

## Features to preserve

| Feature | Priority |
|---|---|
| Public pages: Home, About, Contact | Must have |
| Course catalog and course details | Must have |
| Student, Instructor, Admin role model | Must have |
| Email verification OTP | Must have |
| Login/logout/password reset/change password | Must have |
| Profile management | Must have |
| Course creation/editing with sections and lessons | Must have |
| Cloudinary media uploads | Must have |
| Enrollment and enrolled course list | Must have |
| Course player | Must have |
| Lesson progress tracking | Must have |
| Ratings and reviews | Must have |
| Contact form | Should have |
| Instructor dashboard analytics | Should have |

## Features to replace

| Legacy feature | Target replacement | Priority |
|---|---|---|
| Razorpay checkout | Free enrollment | Must have |
| Redux server state | TanStack Query | Must have |
| Redux authentication state | React Context | Must have |
| Redux form state / ad hoc local form state | React Hook Form + Zod | Must have |
| Frontend-only course draft state | Backend-persisted course draft | Must have |
| Payment-owned enrollment | Dedicated enrollment module | Must have |
| Express-fileupload | Multer upload middleware | Should have |
| Resend/legacy mail ambiguity | Nodemailer-backed email service for this resume scope | Should have |
| Chart.js dashboard | Recharts only where useful | Nice to have |

## Features to remove

| Feature | Priority |
|---|---|
| Shopping cart | Removed |
| Razorpay | Removed |
| Payment verification | Removed |
| Payment success emails | Removed |
| Instructor revenue analytics | Removed |
| Pricing logic | Removed |
| Unnecessary marketing sections | Removed |
| Decorative UI clutter | Removed |
| Duplicate routes | Removed |
| Duplicate shared components | Removed |
| Dead dependencies | Removed |
| Legacy build artifacts tracked in source, if confirmed safe later | Removed |

## Deferred beyond the 15-day scope

| Feature | Priority |
|---|---|
| Cohorts | Deferred |
| Certificates | Deferred |
| Notifications center | Deferred |
| Offline mode | Deferred |
| Multilingual AI | Deferred |
| Advanced moderation workflows | Deferred |
| Real-time chat | Deferred |
| Microservices | Deferred |
| Kubernetes | Deferred |
| Complex recommendation engine | Deferred |
| Multi-agent AI | Deferred |
| Full LMS-grade reporting | Deferred |
| Mobile native app | Deferred |

## Scope rule

The resume-ready product must prove: free enrollment, structured authoring, progress tracking, role approval, and course-scoped AI grounded in instructor-approved resources. Anything that does not support those outcomes is either removed, simplified, or deferred.
