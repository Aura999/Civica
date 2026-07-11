# PHASE 2 DECISION REPORT

## Final product definition

CIVICA is an AI-enabled civic and life-skills learning platform. It is free, role-based, instructor-authored, progress-aware, and enhanced by a course-specific RAG assistant grounded in approved course resources.

## Final must-have features

- Public pages and published course catalog.
- Student signup, email verification, login/logout.
- Free enrollment.
- Authorized course player.
- Lesson-level progress.
- Reviews for enrolled students.
- Instructor approval.
- Draft-based course authoring.
- Admin moderation and categories.
- Course-specific AI assistant.
- Profile and password management.

## Removed features

- Shopping cart.
- Razorpay checkout.
- Payment verification.
- Payment success emails.
- Pricing logic.
- Instructor revenue analytics.
- Duplicate routes and dead legacy code after compatibility windows.

## Deferred features

- Cohorts.
- Certificates.
- Notification center.
- Offline mode.
- Multilingual AI.
- Advanced moderation.
- Real-time chat.
- Microservices/Kubernetes/Kafka.
- Complex recommendations.
- Multi-agent AI.

## Final frontend stack

React, Vite, JavaScript, Tailwind CSS, React Router, TanStack Query, React Context for auth, React Hook Form, Zod, Axios, React Hot Toast, and Recharts only for useful analytics.

## Final backend stack

Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Zod, Multer, Cloudinary, Nodemailer, Helmet, Express Rate Limit, CORS, Compression, and Morgan.

## Final AI stack

OpenAI API, LangChain.js, OpenAI embeddings, MongoDB Atlas Vector Search, PDF text extraction, recursive text splitting, course-scoped retrieval, and source-grounded responses.

## Final state-management strategy

- TanStack Query for server state.
- Auth Context for current user/session.
- React Hook Form for forms.
- Local state for UI controls.
- URL state for search/filter/pagination/route identity.
- Backend persistence for course drafts, enrollment, progress, reviews, instructor approval, and AI chunks.

## Final data-model direction

- Introduce dedicated `Enrollment`.
- Make `Enrollment` the long-term source of truth for student-course access and progress.
- Keep existing `User`, `Course`, `Section`, `SubSection`, and `CourseProgress` temporarily for compatibility.
- Deprecate payment/pricing fields after free enrollment is live.
- Keep sections/lessons as separate collections for 15-day migration safety.
- Introduce `AiDocumentChunk` for RAG.

## Final route strategy

- Move frontend to clean public/dashboard/learning routes.
- Move backend from `/api/v1/*` legacy naming to domain groups under `/api/*`.
- Provide temporary compatibility aliases only where needed during migration.
- Do not preserve legacy endpoint names purely for history.

## Biggest migration risks

1. Extracting enrollment from payment without breaking progress or enrolled-course reads.
2. Removing Redux while route guards and player/course editor still depend on it.
3. Migrating progress from `CourseProgress` into Enrollment without data loss.
4. Course authoring media cleanup and draft persistence.
5. RAG authorization preventing cross-course leakage.

## Expensive-to-reverse decisions

- Dedicated Enrollment as source of truth.
- Removing cart/Razorpay/pricing.
- Backend-persisted course drafts.
- MongoDB Atlas Vector Search rather than separate vector DB.
- Feature-based frontend structure.
- Modular monolith backend structure.

## Existing document inconsistencies recorded

- `CURRENT_STATE.md` says runtime verification had not been performed, while later Phase 0/1 docs now record startup verification. Treat latest Phase 0/1 runtime evidence as authoritative.
- Phase 0 notes current active email sender uses Resend, while Phase 2 target selects Nodemailer for final stack simplicity. This is an intentional future replacement decision, not a current-state claim.
- Legacy endpoint maps use `/api/v1/*`; target route map freezes `/api/*` with temporary aliases.

## Exact next implementation phase

Start with **Security quick fixes**:

1. Remove remaining sensitive/debug logs.
2. Protect course delete with auth, instructor/admin role, and ownership checks.
3. Add missing env example names without values.
4. Add a health endpoint if trivial and non-disruptive.
5. Verify startup and critical route smoke after each small change.

## Interview narrative unlocked by this architecture

### Why Redux was removed

Redux was handling too many unrelated responsibilities: auth, server data, cart, course editor state, payment loading, and player progress. The target architecture assigns each state type to the right owner, reducing stale data and boilerplate.

### Why TanStack Query was introduced

Most CIVICA data is server state: courses, categories, enrollments, progress, reviews, profile, analytics, and AI conversations. TanStack Query gives caching, refetching, mutation status, and invalidation without building a custom Redux server-state layer.

### Why modular monolith was chosen

CIVICA needs clear boundaries but not distributed systems complexity. A modular monolith keeps deployment simple while making auth, courses, enrollments, progress, reviews, AI, and admin logic maintainable.

### Why payments were removed

The product serves underserved learners and volunteer instructors. Payments add friction, contradict the mission, and create large technical complexity around cart, checkout, verification, pricing, and revenue analytics.

### Why free enrollment fits the product

Free enrollment makes the learner journey direct: browse, enroll, learn, track progress, ask course-specific questions. It aligns the product with civic access rather than commerce.

### Why MongoDB Atlas Vector Search was selected

The app already uses MongoDB Atlas. Vector Search keeps embeddings and metadata near course data, supports `courseId` filtering, avoids another database, and is easier to explain and deploy for this scope.

### Why course drafts are backend-persisted

Course authoring spans metadata, uploads, sections, lessons, and publish validation. Backend drafts survive refreshes, support ownership checks, and prevent losing complex state in Redux/local memory.

### Why a dedicated Enrollment model is preferred

Enrollment is currently duplicated across users, courses, and course progress. A dedicated model centralizes access, progress, last lesson, enrollment status, and completion state, making free enrollment and learning authorization safer.
