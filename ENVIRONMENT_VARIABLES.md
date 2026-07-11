# ENVIRONMENT VARIABLES

This inventory lists variable names only. It is based on source references and tracked example files. Real `.env` values were not opened or copied.

## Frontend

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `REACT_APP_BASE_URL` | Base URL used by `src/services/apis.js` to build frontend API URLs | Required for frontend API calls | Frontend |
| `RAZORPAY_KEY` | Referenced by frontend payment options in `src/services/operations/studentFeaturesAPI.js`; CRA normally requires a `REACT_APP_` prefix for browser exposure | Required if current Razorpay frontend flow is used, but naming requires verification | Frontend |

## Backend

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `PORT` | Express server port; defaults to `4000` if unset | Optional | Backend |
| `FOLDER_NAME` | Cloudinary upload folder for course thumbnails, videos, and profile images | Required for upload organization when uploads run | Backend |

## MongoDB

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `MONGODB_URL` | MongoDB connection string used by `server/config/database.js` | Required | Backend |

## JWT

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `JWT_SECRET` | Secret used to sign and verify JWT tokens | Required | Backend |

## Cloudinary

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `CLOUD_NAME` | Cloudinary cloud name | Required for uploads | Backend |
| `API_KEY` | Cloudinary API key | Required for uploads | Backend |
| `API_SECRET` | Cloudinary API secret | Required for uploads | Backend |

## Razorpay

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `RAZORPAY_KEY` | Razorpay key used by backend instance creation and referenced by frontend checkout options | Required for paid checkout | Backend and frontend reference |
| `RAZORPAY_SECRET` | Razorpay secret used by backend instance creation and payment signature verification | Required for paid checkout | Backend |

## Email

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `RESEND_API_KEY` | Bearer token for Resend email API used by `server/utils/mailSender.js` | Required for current email sender | Backend |
| `MAIL_HOST` | Legacy/commented Nodemailer SMTP host; present in `server/.env.example` | Not required by current active sender; required only if Nodemailer path is restored | Backend |
| `MAIL_USER` | Legacy/commented Nodemailer SMTP user; present in `server/.env.example` | Not required by current active sender; required only if Nodemailer path is restored | Backend |
| `MAIL_PASS` | Legacy/commented Nodemailer SMTP password; present in `server/.env.example` | Not required by current active sender; required only if Nodemailer path is restored | Backend |

## Deployment

| Variable | Purpose | Required | Layer |
|---|---|---|---|
| `REACT_APP_BASE_URL` | Must point deployed frontend to deployed backend API base, expected to include `/api/v1` based on `src/services/apis.js` endpoint composition | Required in deployed frontend | Frontend |
| `PORT` | Hosting platform may provide this for backend runtime | Platform dependent | Backend |

## Example file coverage

- Found: `server/.env.example`.
- Missing: root/frontend `.env.example`.
- Gap: `server/.env.example` only lists `JWT_SECRET`, `MONGODB_URL`, `MAIL_HOST`, `MAIL_USER`, and `MAIL_PASS`; it does not list all variables referenced by current source.
