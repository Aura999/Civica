# Backend Security Checklist

Use this checklist after installing dependencies and starting the backend.

| Check | Not tested | Passed | Failed | Notes |
| --- | --- | --- | --- | --- |
| Invalid JWT is rejected with a safe 401 response | [x] | [ ] | [ ] | Runtime verification pending |
| Expired JWT is rejected with a safe 401 response | [x] | [ ] | [ ] | Runtime verification pending |
| Student cannot access Instructor-only route | [x] | [ ] | [ ] | Runtime verification pending |
| Unapproved Instructor cannot access Instructor-only route | [x] | [ ] | [ ] | Runtime verification pending |
| Instructor cannot modify another Instructor's course | [x] | [ ] | [ ] | Runtime verification pending |
| Unauthenticated course deletion is rejected | [x] | [ ] | [ ] | Automated test added; not executed in current shell |
| Admin can access Admin-only category creation | [x] | [ ] | [ ] | Runtime verification pending |
| Non-Admin cannot create category | [x] | [ ] | [ ] | Runtime verification pending |
| Invalid signup payload returns structured 400 | [x] | [ ] | [ ] | Runtime verification pending |
| Invalid login payload returns structured 400 | [x] | [ ] | [ ] | Automated test added; not executed in current shell |
| Repeated login attempts are rate limited | [x] | [ ] | [ ] | Runtime verification pending |
| Oversized JSON body is rejected | [x] | [ ] | [ ] | Runtime verification pending |
| Disallowed CORS origin is rejected safely | [x] | [ ] | [ ] | Runtime verification pending |
| Browser requests from configured frontend origin still work | [x] | [ ] | [ ] | Runtime verification pending |
| `GET /api/health` returns status and database state | [x] | [ ] | [ ] | Automated test added; not executed in current shell |
| Unknown API route returns standardized 404 | [x] | [ ] | [ ] | Automated test added; not executed in current shell |
| Error responses do not expose stack traces in production/test | [x] | [ ] | [ ] | Automated test added; not executed in current shell |
| Login response does not include password hash | [x] | [ ] | [ ] | Runtime verification pending |
| Signup response does not include password hash | [x] | [ ] | [ ] | Runtime verification pending |
| Profile response does not include password/reset token fields | [x] | [ ] | [ ] | Runtime verification pending |
| OTP response does not include OTP value | [x] | [ ] | [ ] | Runtime verification pending |
| Full course content requires enrollment, owner, or Admin access | [x] | [ ] | [ ] | Runtime verification pending |
| Progress update requires enrollment | [x] | [ ] | [ ] | Runtime verification pending |
| Review creation requires enrollment | [x] | [ ] | [ ] | Runtime verification pending |
| Razorpay endpoints remain Student-only | [x] | [ ] | [ ] | Runtime verification pending |
| No secret values appear in startup logs | [x] | [ ] | [ ] | Runtime verification pending |
