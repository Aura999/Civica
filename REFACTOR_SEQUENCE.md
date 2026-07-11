# REFACTOR SEQUENCE

Objective: move toward CIVICA Ultimate Edition while keeping the application runnable after each phase.

## Phase 1.1: Safety hardening and test harness

- Objective: add coverage around current behavior before major rewrites.
- Files likely affected: test setup files, route/API tests, frontend smoke tests.
- Dependencies: stable env and local startup.
- Risks: tests may expose existing bugs; do not fix unrelated behavior in the same step.
- Rollback point: remove new tests only.
- Verification checklist: backend starts, frontend starts, auth smoke, catalog smoke, course details smoke.
- Ship together: no, tests can ship alone.

## Phase 1.2: Backend validation and error baseline

- Objective: introduce validation middleware and centralized error shape without changing feature behavior.
- Files likely affected: backend middleware, route registrations, controllers incrementally.
- Dependencies: API map and tests.
- Risks: response shape changes can break frontend.
- Rollback point: per-route validation adapter.
- Verification checklist: invalid login, invalid upload, missing course, unauthorized route.
- Ship together: likely yes for any response contract change.

## Phase 1.3: Extract backend services behind existing routes

- Objective: create modular monolith internals while preserving endpoint paths.
- Files likely affected: controllers, new domain services for auth, users, courses, content, enrollment, reviews, media, email.
- Dependencies: validation/error baseline.
- Risks: multi-model orchestration regressions.
- Rollback point: per-controller extraction.
- Verification checklist: all existing API workflows.
- Ship together: backend only if endpoint contracts remain stable.

## Phase 1.4: Create enrollment service before payment removal

- Objective: move enrollment writes out of `payments.js`.
- Files likely affected: `payments.js`, new enrollment service, `Course`, `User`, `CourseProgress` interactions.
- Dependencies: service layer.
- Risks: duplicated enrollment/progress writes.
- Rollback point: payment controller calls old helper.
- Verification checklist: paid enrollment, free-course branch, enrolled courses, progress document creation.
- Ship together: backend only if API unchanged.

## Phase 1.5: Frontend query foundation

- Objective: introduce TanStack Query around existing API calls without removing Redux yet.
- Files likely affected: app provider setup, API/query hooks, catalog/course/profile/player reads.
- Dependencies: stable endpoints.
- Risks: double fetching and stale Redux/query duplication.
- Rollback point: per-feature query hook.
- Verification checklist: catalog, course details, current user, enrolled courses, player.
- Ship together: frontend only.

## Phase 1.6: Auth Context migration

- Objective: move token/current user/session concerns from Redux to Auth Context.
- Files likely affected: `App.jsx`, auth route guards, auth operations, navbar/sidebar/profile consumers.
- Dependencies: current-user query foundation.
- Risks: route access flicker, stale localStorage token, logout cleanup.
- Rollback point: keep Redux auth in parallel until all consumers migrated.
- Verification checklist: login/logout/refresh/protected routes/role routes.
- Ship together: frontend only if API unchanged.

## Phase 1.7: Remove cart and Razorpay, add free enrollment flow

- Objective: replace cart/payment checkout with direct free enrollment.
- Files likely affected: cart components/slice, course CTA, payment service/constants, backend payment routes/controllers/config, enrollment service/API.
- Dependencies: enrollment service exists; frontend auth/query foundation exists.
- Risks: biggest cross-stack coupling; current enrollment side effects live in payment controller.
- Rollback point: keep old payment endpoints until free enrollment verified.
- Verification checklist: enroll, duplicate enroll, enrolled courses, player access, enrollment email if preserved.
- Ship together: yes, frontend and backend must coordinate.

## Phase 1.8: Feature-based frontend structure

- Objective: reorganize frontend by features after state/API migration reduces coupling.
- Files likely affected: `src/components/core`, `src/pages`, `src/services`, `src/hooks`, `src/utils`.
- Dependencies: Auth Context, Query hooks, cart removal.
- Risks: import breakage.
- Rollback point: move one feature at a time.
- Verification checklist: route smoke for every page.
- Ship together: frontend only.

## Phase 1.9: React Hook Form + Zod form rewrite

- Objective: standardize forms and validation.
- Files likely affected: auth forms, course editor forms, profile settings, contact form, review modal.
- Dependencies: feature structure preferred.
- Risks: validation changes user-visible behavior.
- Rollback point: per-form migration.
- Verification checklist: valid/invalid form submissions for each role.
- Ship together: frontend plus backend if validation contract changes.

## Phase 1.10: UI simplification and route cleanup

- Objective: simplify layout, remove duplicate route casing, improve dashboard/player navigation.
- Files likely affected: `App.jsx`, dashboard layout, navbar/sidebar, route constants.
- Dependencies: auth and feature structure.
- Risks: broken deep links.
- Rollback point: route compatibility redirects.
- Verification checklist: all public/protected URLs.
- Ship together: frontend only unless backend route names change.

## Phase 1.11: Data model migration planning

- Objective: decide Enrollment model and course content representation.
- Files likely affected: models, services, migrations/scripts.
- Dependencies: free enrollment and tests.
- Risks: data migration, orphan cleanup, progress loss.
- Rollback point: read-only compatibility layer before write migration.
- Verification checklist: existing users/courses/progress.
- Ship together: backend plus migration.

## Phase 1.12: RAG assistant integration

- Objective: add course-specific learning assistant after course/player/enrollment are stable.
- Files likely affected: backend assistant module, course content indexing, player UI, auth/authorization checks.
- Dependencies: stable course content, enrollment access, modular backend.
- Risks: data privacy, cost, latency, authorization.
- Rollback point: feature flag.
- Verification checklist: enrolled-only access, course-specific responses, failure states.
- Ship together: frontend and backend.

## Phase 1.13: Deployment and dependency cleanup

- Objective: remove unused packages, split frontend/backend dependency boundaries, Vite migration, deployment config.
- Files likely affected: manifests, lockfiles, build config, environment examples.
- Dependencies: feature migrations complete.
- Risks: build/runtime drift.
- Rollback point: branch-level rollback.
- Verification checklist: clean install, build, tests, production smoke.
- Ship together: coordinated deployment.
