# BASELINE TEST CHECKLIST

Use this checklist for manual runtime verification. Do not mark an item as passed unless it has been tested against a running frontend, backend, database, and configured integrations.

Legend: `[ ] Not tested` `[ ] Passed` `[ ] Failed` `Notes:`

## Frontend startup

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Install frontend dependencies from root `package.json` | [ ] | [ ] | [ ] |  |
| Start frontend development server with `npm start` | [ ] | [x] | [ ] | Frontend dev server started; legacy Create React App / webpack-dev-server / Browserslist warnings were observed and intentionally not fixed in Phase 0. |
| Confirm React frontend compiles | [ ] | [x] | [ ] | React frontend compiled successfully. |
| Confirm landing page loads | [x] | [ ] | [ ] | Browser verification still pending. |
| Confirm browser console has no critical errors | [x] | [ ] | [ ] | Browser verification still pending. |

## Backend startup

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Install backend dependencies from `server/package.json` | [ ] | [ ] | [ ] |  |
| Start backend server with `npm run dev` or `npm start` in `server/` | [ ] | [x] | [ ] | Express backend started successfully on port 4000 after MongoDB connection was established. |
| Confirm database connection succeeds | [ ] | [x] | [ ] | MongoDB connection was established successfully. |
| Confirm backend waits for MongoDB before listening | [ ] | [x] | [ ] | Runtime evidence confirms backend startup now waits for MongoDB before listening. |
| Confirm MongoDB URI is not printed during startup | [ ] | [x] | [ ] | Startup no longer prints the MongoDB URI. |
| Confirm Cloudinary configuration initializes | [x] | [ ] | [ ] | Cloudinary upload initialization and actual uploads remain unverified. |
| Confirm no fatal startup errors | [ ] | [x] | [ ] | Latest verified startup completed successfully. |

## Authentication

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Signup | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| OTP verification | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Login | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Logout | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Forgot password | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Reset password | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Role-based route access | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |

## Student workflow

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Browse catalog | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Open course details | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Add course to cart | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Complete checkout | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| View enrolled courses | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Open course player | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Mark lesson complete | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Verify progress persistence | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Submit review | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |

## Instructor workflow

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Instructor login | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Course creation | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Thumbnail upload | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Section creation | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Lesson creation | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Video upload | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Course editing | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Course deletion | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Dashboard verification | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |

## Profile workflow

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| View profile | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Edit profile | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Update image | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Change password | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Delete account | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |

## Contact and email

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Submit contact form | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| OTP email | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Password-reset email | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Payment email | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |
| Enrollment email | [x] | [ ] | [ ] | Not tested during startup-diagnostics patch. |

## Failure cases

| Check | Not tested | Passed | Failed | Notes |
|---|---|---|---|---|
| Invalid login | [ ] | [ ] | [ ] |  |
| Expired OTP | [ ] | [ ] | [ ] |  |
| Unauthorized route | [ ] | [ ] | [ ] |  |
| Duplicate review | [ ] | [ ] | [ ] |  |
| Invalid upload | [ ] | [ ] | [ ] |  |
| Payment failure | [ ] | [ ] | [ ] |  |
| Missing course | [ ] | [ ] | [ ] |  |
| Backend unavailable | [ ] | [ ] | [ ] |  |
