# PHASE 2 IMPLEMENTATION PLAN

This plan converts frozen decisions into coding phases. Each phase should keep the application runnable.

## 1. Security quick fixes

- Objective: remove obvious risks before broad refactor.
- Inputs: Phase 0/1 risks.
- Files affected: auth middleware, course delete route, debug logs, env examples.
- Dependencies: none.
- Risks: accidental response behavior changes.
- Rollback point: revert individual fix.
- Verification checklist: backend starts, protected delete requires auth, no secret logs.
- Resume claim unlocked: hardened legacy MERN baseline.

## 2. Shared backend error and validation utilities

- Objective: add `ApiError`, `ApiResponse`, `asyncHandler`, `validate`.
- Inputs: target backend architecture.
- Files affected: backend shared/middleware and a few pilot routes.
- Dependencies: security quick fixes.
- Risks: frontend expects old error shapes.
- Rollback point: pilot route only.
- Verification checklist: invalid payload, unauthorized, not found.
- Resume claim unlocked: standardized Express API foundation.

## 3. Standalone enrollment module

- Objective: create service-owned free enrollment without removing payment yet.
- Inputs: `FREE_ENROLLMENT_DESIGN.md`, `TARGET_DATA_MODEL_DECISIONS.md`.
- Files affected: enrollment model/routes/controller/service, user/course/progress adapters.
- Dependencies: validation/error utilities.
- Risks: duplicate writes and progress mismatch.
- Rollback point: keep old payment enrollment path.
- Verification checklist: enroll, duplicate enroll, enrolled list, access check.
- Resume claim unlocked: domain-owned enrollment module.

## 4. Payment decoupling

- Objective: route payment flow through enrollment service, then remove cart/Razorpay.
- Inputs: enrollment module.
- Files affected: payment controller, frontend cart/payment code, APIs.
- Dependencies: standalone enrollment verified.
- Risks: cross-stack breakage.
- Rollback point: old payment endpoints remain until free enrollment works.
- Verification checklist: free enroll, no cart route dependency, player access.
- Resume claim unlocked: mission-aligned free enrollment replacing payments.

## 5. TanStack Query introduction

- Objective: add query client and migrate server reads.
- Inputs: state ownership model.
- Files affected: app providers, course/category/profile/enrollment hooks.
- Dependencies: stable APIs.
- Risks: duplicate Redux/query state.
- Rollback point: feature-by-feature query hooks.
- Verification checklist: catalog, course detail, profile, enrolled courses.
- Resume claim unlocked: modern server-state architecture.

## 6. Auth Context migration

- Objective: move session/current user from Redux to Auth Context.
- Inputs: target frontend architecture.
- Files affected: app providers, route guards, auth hooks, navbar/sidebar.
- Dependencies: query foundation.
- Risks: route flicker and stale sessions.
- Rollback point: parallel Redux auth until complete.
- Verification checklist: login, logout, refresh, role routes.
- Resume claim unlocked: explicit auth/session boundary.

## 7. Redux feature-by-feature removal

- Objective: remove slices after owners exist.
- Inputs: `STATE_OWNERSHIP_MODEL.md`.
- Files affected: auth/profile/course/cart/viewCourse consumers.
- Dependencies: enrollment, query, auth context.
- Risks: hidden consumers.
- Rollback point: remove one slice at a time.
- Verification checklist: route smoke and workflow smoke after each slice.
- Resume claim unlocked: Redux-free frontend.

## 8. Frontend feature architecture

- Objective: move code into target feature folders.
- Inputs: `TARGET_FRONTEND_ARCHITECTURE.md`.
- Files affected: `src/features`, layouts, shared components.
- Dependencies: state owners stable.
- Risks: import breakage.
- Rollback point: one feature move at a time.
- Verification checklist: all routes compile and render.
- Resume claim unlocked: feature-based React architecture.

## 9. UI design system

- Objective: consolidate shared UI.
- Inputs: cleanup candidates.
- Files affected: `components/ui`, feedback, navigation.
- Dependencies: feature structure.
- Risks: visual regressions.
- Rollback point: component-by-component.
- Verification checklist: forms, modals, buttons, tables.
- Resume claim unlocked: reusable UI system.

## 10. Public UI redesign

- Objective: simplify landing, about, contact, catalog, course detail.
- Inputs: final product positioning.
- Files affected: public routes/features.
- Dependencies: UI system.
- Risks: broken course CTA.
- Rollback point: route-by-route.
- Verification checklist: public route smoke, search/filter, course detail.
- Resume claim unlocked: mission-focused product UI.

## 11. Dashboard redesign

- Objective: simplify role dashboards.
- Inputs: target route map.
- Files affected: dashboard layouts, profile, admin, instructor.
- Dependencies: auth/role routes.
- Risks: role access errors.
- Rollback point: per role dashboard.
- Verification checklist: student/instructor/admin route access.
- Resume claim unlocked: role-based dashboard UX.

## 12. Course editor redesign

- Objective: backend-persisted draft editor.
- Inputs: `COURSE_AUTHORING_DESIGN.md`.
- Files affected: course editor frontend, course/content backend services.
- Dependencies: feature architecture and upload service.
- Risks: draft loss and publish validation gaps.
- Rollback point: keep old editor until draft flow works.
- Verification checklist: draft, metadata, upload, sections, lessons, publish.
- Resume claim unlocked: production-style course authoring workflow.

## 13. Progress flow cleanup

- Objective: move progress into Enrollment-backed model.
- Inputs: data model decisions.
- Files affected: progress/enrollment services, learning UI.
- Dependencies: enrollment model.
- Risks: progress migration.
- Rollback point: read compatibility with old `CourseProgress`.
- Verification checklist: complete lesson, refresh, continue last lesson.
- Resume claim unlocked: idempotent learning progress.

## 14. Backend modularization

- Objective: complete modular monolith structure.
- Inputs: target backend architecture.
- Files affected: backend modules and route registration.
- Dependencies: service extraction lessons.
- Risks: broad route regressions.
- Rollback point: module-by-module.
- Verification checklist: API suite.
- Resume claim unlocked: modular Express monolith.

## 15. RAG integration

- Objective: add course-specific AI assistant.
- Inputs: `RAG_SYSTEM_DESIGN.md`.
- Files affected: AI module, Cloudinary/resource handling, learning UI.
- Dependencies: enrollment access, course resources, backend modules.
- Risks: authorization, cost, retrieval quality.
- Rollback point: feature flag.
- Verification checklist: upload/index, enrolled query, unenrolled denial, citations.
- Resume claim unlocked: AI-enabled course assistant with RAG.

## 16. Testing

- Objective: cover critical workflows.
- Inputs: non-functional requirements.
- Files affected: test setup/spec files.
- Dependencies: core workflows stable.
- Risks: test flakiness.
- Rollback point: isolate unstable tests.
- Verification checklist: unit/API/E2E smoke.
- Resume claim unlocked: tested full-stack workflows.

## 17. Documentation

- Objective: align README, Swagger, Postman, architecture docs.
- Inputs: final implemented architecture.
- Files affected: docs only.
- Dependencies: APIs stable.
- Risks: stale docs.
- Rollback point: docs-only.
- Verification checklist: setup from README works.
- Resume claim unlocked: portfolio-ready documentation.

## 18. Deployment verification

- Objective: verify Vercel, Render, Atlas, Cloudinary deployment.
- Inputs: env examples, CI.
- Files affected: deployment config and docs.
- Dependencies: app stable.
- Risks: environment mismatch.
- Rollback point: previous deployment.
- Verification checklist: production smoke for auth/catalog/enroll/learn.
- Resume claim unlocked: deployed production-like MERN/AI app.
