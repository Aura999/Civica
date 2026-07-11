# NON-FUNCTIONAL REQUIREMENTS

## Security

- JWT expiry must be enforced.
- Passwords must be hashed with bcrypt.
- Inputs must be validated with Zod before controller/service execution.
- Rate limiting must protect auth, OTP, password reset, contact, upload, and AI endpoints.
- CORS must use an allowlist, not `*`, in production.
- Helmet must set safe security headers.
- File validation must check MIME type, extension, size, and role/ownership.
- Error responses must be sanitized and must not expose secrets, stack traces, connection strings, or environment values.
- Role checks must exist on every protected route.
- Ownership checks must protect instructor course, section, lesson, media, and AI source operations.

## Performance

- Course lists must be paginated.
- Common filters must have MongoDB indexes.
- Use lean queries where mutation methods/document methods are not needed.
- Use route lazy loading for larger frontend route groups.
- Use TanStack Query caching for repeated course/category/profile/enrollment reads.
- Images should be optimized through Cloudinary transformations where practical.
- Upload limits must be reasonable for the target deployment.

## Reliability

- Centralized error handling is required.
- `GET /api/health` must report basic service health without exposing secrets.
- Backend startup must connect to MongoDB before listening.
- Database startup failure must exit safely.
- Upload flows need rollback or cleanup strategy for failed metadata writes.
- Progress updates should be idempotent.
- Enrollment should be idempotent or return a clear conflict without duplicate writes.
- Multi-document writes should use transactions where available.

## Accessibility

- Use semantic HTML.
- Support keyboard navigation.
- Preserve visible focus states.
- Inputs must have labels.
- Validation errors must be described near fields.
- Text and controls must meet reasonable contrast.
- Layouts must be responsive for mobile and desktop.
- Buttons/links must have clear accessible names.

## Testing

Minimum workflow coverage:

- Backend startup/health.
- Auth: signup, OTP, login, logout, password reset.
- Role authorization: student/instructor/admin denied/allowed paths.
- Course authoring: draft, metadata, section, lesson, upload, publish.
- Enrollment: enroll, duplicate enroll, unauthorized enroll.
- Learning: open enrolled course, mark lesson complete, persist progress.
- Reviews: create, duplicate prevention, edit/delete own review.
- Admin: approve instructor, manage category, moderate course.
- AI: index source, query enrolled course, deny unenrolled course.
- Delete/archive: account/course/course content safety paths.

## Documentation

- README must explain setup and architecture.
- Swagger/OpenAPI must document backend APIs.
- Postman collection must support manual verification.
- Architecture docs must stay aligned with implementation.
- Environment examples must include all required variable names without values.
