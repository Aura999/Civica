# TARGET FRONTEND ARCHITECTURE

## Target structure

```text
src/
  app/
    App.jsx
    router.jsx
    providers.jsx
    queryClient.js
  features/
    auth/
    courses/
    enrollments/
    learning/
    reviews/
    profile/
    instructor/
    admin/
    ai-assistant/
    contact/
  layouts/
    PublicLayout.jsx
    AuthLayout.jsx
    DashboardLayout.jsx
    LearningLayout.jsx
  components/
    ui/
    feedback/
    navigation/
  hooks/
  lib/
    apiClient.js
    constants.js
    permissions.js
    queryKeys.js
  schemas/
  assets/
  styles/
```

## Folder rules

| Folder | Responsibility | Allowed contents | Prohibited contents | Import direction | State ownership |
|---|---|---|---|---|---|
| `app/` | App shell, router, providers, query client | `App`, router config, provider composition | Feature UI internals, business logic | May import layouts/features/providers | Provider state only |
| `features/auth/` | Login, signup, OTP, session API/hooks | auth pages/components/hooks/api | Course/profile business logic | May import shared UI/lib/schemas | Auth Context and auth forms |
| `features/courses/` | Public courses and course authoring base | course APIs, catalog, details, metadata forms | Enrollment writes, payment logic | May import shared UI/lib/schemas | Query state and RHF forms |
| `features/enrollments/` | Free enrollment and enrolled courses | enrollment API/hooks/pages | Razorpay/cart logic | May import courses read types only through APIs | Query/mutation state |
| `features/learning/` | Course player and lesson progress UI | learning routes, lesson navigator, progress hooks | Course authoring admin logic | May import enrollment access hooks | Query/local player UI |
| `features/reviews/` | Course reviews | review API/hooks/forms | Course fetching outside review needs | May import auth/query keys/shared UI | Query/mutation and RHF |
| `features/profile/` | Profile/settings/password | profile API/hooks/forms | Admin user management | May import auth context | Query and RHF |
| `features/instructor/` | Instructor dashboard and owned courses | owned course pages, analytics hooks | Admin moderation | May import courses/enrollments APIs through stable hooks | Query and local UI |
| `features/admin/` | Admin users/categories/moderation | approval, categories, moderation APIs | Student learning UI | May import shared UI/lib | Query and RHF |
| `features/ai-assistant/` | Course RAG assistant UI | chat panel, source cards, AI hooks | Generic global chatbot | May import learning context/course ID | Query/mutation or local conversation if not persisted |
| `features/contact/` | Contact page/form | contact API/hook/form | Auth/profile logic | May import shared UI | RHF and mutation |
| `layouts/` | Route layout shells | Public/Auth/Dashboard/Learning layouts | Fetching domain data except layout user needs | May import navigation/shared/auth | Local layout UI only |
| `components/` | Shared presentational UI | buttons, inputs, modals, nav primitives, loaders | Business logic, feature API calls | May import `lib` only | Local UI state only |
| `hooks/` | Generic cross-feature hooks | viewport, outside click, debounce | Feature-specific queries | Imported by features/components | Local browser state |
| `lib/` | Shared technical utilities | Axios client, constants, permissions, query keys | Components/pages | Imported by everyone | No React state except configured clients |
| `schemas/` | Shared Zod schemas | reusable validation primitives | API calls, UI | Imported by features | Validation only |
| `assets/` | Static assets | images, icons, media | Generated build files | Imported by components/features | None |
| `styles/` | Global styles | Tailwind entry/global CSS | Component business logic | Imported by app | None |

## Architectural rules

1. Feature code stays inside its feature.
2. Shared UI contains no business logic.
3. API calls must go through a single Axios client.
4. Query hooks stay near the feature that owns them.
5. Route authorization is centralized.
6. Components must not call Redux.
7. Components must not store duplicated server state.
8. Form validation uses Zod schemas.
9. Feature modules must not import from each other arbitrarily.
10. Circular dependencies are prohibited.
11. Pages orchestrate; small components render.
12. Shared components should remain generic.
13. Only authenticated user/session data belongs in Auth Context.
14. Course drafts are persisted to the backend.
15. Search/filter/pagination state belongs in the URL.

## Final frontend data flow

```text
Component
  -> query/mutation hook
  -> feature API function
  -> shared Axios client
  -> Express API
```

## Final mutation flow

```text
Form
  -> React Hook Form
  -> Zod validation
  -> TanStack Query mutation
  -> API request
  -> cache invalidation
  -> UI refresh
```

## Import boundary examples

- `features/courses` can import `components/ui/Button`, `lib/apiClient`, `lib/queryKeys`, and course schemas.
- `components/ui` must not import `features/courses`.
- `features/learning` can request course content through its own query hook; it must not read raw course editor state.
- `features/admin` can moderate courses through admin APIs; it must not reuse instructor-only mutation hooks directly.
