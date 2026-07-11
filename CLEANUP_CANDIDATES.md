# CLEANUP CANDIDATES

Phase 1 static audit. Do not delete until each candidate is verified in a cleanup phase.

| File path | Symbol or item | Evidence | Confidence | Recommended action | Dependency risk |
|---|---|---|---|---|---|
| `src/App.jsx` | duplicate settings routes | `dashboard/Settings` and `dashboard/settings` both render `Settings` | Confirmed | Merge | Low |
| `server/routes/Course.js` | commented `getProgressPercentage` route | route and controller import exist, route commented | Confirmed | Remove or restore intentionally | Medium |
| `server/controllers/courseProgress.js` | commented `getProgressPercentage` function | large commented function | Confirmed | Remove or restore intentionally | Medium |
| `server/routes/Payments.js` | commented `verifySignature` route/import | commented route and unused import placeholder | Confirmed | Remove with Razorpay | Low |
| `server/config/razorpay.js` | old commented instance creation | commented legacy config | Confirmed | Remove with Razorpay | Low |
| `server/utils/mailSender.js` | commented Nodemailer implementation | active sender uses Axios/Resend | Confirmed | Remove if Resend retained | Medium |
| `server/package.json` | `nodemailer` | only found in commented code | Likely | Remove after email strategy decision | Medium |
| `package.json` root | backend-only dependencies | root includes Express/Mongoose/Razorpay/Cloudinary/etc. though frontend is CRA | Likely | Remove during Vite split cleanup | High |
| `server/package.json` | `crypto-random-string`, `node-schedule` | no active source usage found in server scan | Likely | Verify then remove | Low |
| `package.json` root | `showdown`, `bcryptjs`, backend libs | no confirmed frontend usage for several root deps | Likely | Verify via build/import audit | Medium |
| `src/services/operations/pageAndComponntDatas.js` | misspelled filename | imported by `Catalog.jsx`; typo in name | Confirmed | Rename during architecture migration | Medium |
| `server/models/Subsection.js` | filename/model casing mismatch | file `Subsection.js`, model `SubSection` | Confirmed | Normalize later | Medium |
| `server/models/Course.js` | `studentsEnroled` field spelling | used across frontend/backend | Confirmed | Migrate carefully | High |
| `src/components/core/Course/CourseDetailsCard.jsx` | old commented component copy | file contains commented prior implementation before active implementation | Confirmed | Remove after comparison | Medium |
| `server/controllers/Course.js` | commented older `getCourseDetails` implementation | large commented block | Confirmed | Remove after tests cover current behavior | Medium |
| `src/components/core/ContactUsPage/ContactForm.jsx` | wrapper around `ContactUsForm` | very thin wrapper | Confirmed | Merge | Low |
| `src/components/core/AboutPage/ContactFormSection.jsx` | wrapper around `ContactUsForm` | embeds same form with section title | Confirmed | Merge/compose | Low |
| `src/hooks/useRouteMatch.js` | custom route hook | no confirmed imports found in source scan | Likely | Verify then remove | Low |
| `src/services/formatDate.js` and `src/utils/dateFormatter.js` | duplicate date formatting helpers | both used in different places | Confirmed | Merge | Medium |
| `server/syncCategories.js` | standalone script | not imported by server entry/routes | Likely | Document or move to scripts | Low |
| `build/` | generated CRA output | production build artifact | Confirmed | Do not edit, regenerate only | Low |
| `server/mail/templates/*` | hardcoded Cloudinary logo URLs | templates include fixed Cloudinary asset URL | Confirmed | Move to config/assets | Low |
| `server/controllers/ContactUs.js` | hardcoded support recipient | literal recipient email | Confirmed | Move to env/config | Medium |
| `server/controllers/resetPassword.js` | hardcoded frontend reset URL | deployed URL literal | Confirmed | Move to env/config | Medium |
| `src/assets/Logo/rzp_logo.png` | Razorpay logo | only needed for checkout flow | Confirmed | Remove when Razorpay removed | Low |
| `src/components/core/Dashboard/Cart/*` | cart feature | future target removes cart | Confirmed | Remove after free enrollment | High |
| `src/slices/cartSlice.js` | cart Redux slice | future target removes cart | Confirmed | Remove after free enrollment | High |
| `server/controllers/payments.js` | payment module | future target removes payment | Confirmed | Replace with enrollment module | High |
| `server/routes/Payments.js` | payment routes | future target removes payment | Confirmed | Remove after frontend migration | High |
| `src/components/Common/Navbar.jsx` | debug logs and direct fetch | logs sublinks/API and fetches category data | Confirmed | Rewrite | Medium |
| `src/components/core/Course/CourseDetailsCard.jsx` | debug logs enrollment state | active console logs | Confirmed | Remove logs | Low |
| `server/middleware/auth.js` | logs decoded token/user role data | active console logs | Confirmed | Remove logs | Medium |
| `server/models/OTP.js` | email side effect in model | pre-save hook sends mail | Confirmed | Move to service | High |

## Notes

- Items marked Likely require import/build/runtime verification before deletion.
- Future payment removal has high dependency risk because enrollment currently lives inside payment code.
- Future manifest cleanup should wait until the Vite/frontend and backend dependency boundaries are clear.
