# COURSE AUTHORING DESIGN

## Target draft workflow

1. Instructor creates empty course draft.
2. Backend returns `courseId`.
3. Metadata is saved incrementally.
4. Thumbnail is uploaded.
5. Sections are created.
6. Lessons are created.
7. Resources are uploaded.
8. Instructor previews course.
9. Validation runs before publish.
10. Course is published.

## Draft state

- Draft exists in backend as soon as creation starts.
- Draft has owner, status, timestamps, and incomplete metadata allowed.
- Draft can be resumed from `/dashboard/courses/:courseId/edit`.
- Draft must not live only in global frontend state.

## Published state

- Published courses appear in public catalog.
- Publishing requires validation.
- Unpublishing hides course from new public discovery but should not break enrolled learner access unless admin removes it for safety.

## Ownership checks

- Instructor can edit only owned courses.
- Admin can moderate/publish/unpublish/remove inappropriate courses.
- Ownership checks live in backend services, not frontend UI only.

## Validation rules before publish

- Course title present.
- Description present.
- Category selected.
- Thumbnail present.
- At least one section.
- At least one lesson.
- Required lesson resource exists: video, PDF, image, or text resource according to lesson type.
- Instructor account approved.
- No unsupported file/resource type.

## Upload behavior

- Use Multer for receiving files.
- Validate MIME type and size before Cloudinary upload.
- Store Cloudinary URL and public ID.
- Roll back metadata if upload fails.
- Keep uploaded resources associated with course and lesson.

## Update behavior

- Metadata saves incrementally.
- Sections and lessons save independently.
- Publish validation runs server-side.
- Query invalidation updates editor, owned courses, public course detail if published.

## Delete behavior

- Instructor can delete owned draft.
- Published course deletion should be restricted; prefer unpublish/archive when learners exist.
- Delete operations must clean associated media and AI chunks when implemented.
- Multi-document delete must use service-level orchestration.

## Preview behavior

- Instructor preview uses same learning UI shell but bypasses enrollment with ownership authorization.
- Preview clearly marks draft/unpublished state.

## Reordering behavior

- Should have if feasible.
- Store `order` on sections and lessons.
- Reorder endpoint accepts ordered IDs and validates ownership.
- If not completed in 15-day scope, stable creation order is acceptable.

## Autosave strategy

- Must not autosave every keystroke initially.
- Save on step submit or explicit Save button.
- Nice-to-have debounced autosave for metadata after baseline editor works.

## Cache invalidation

- After metadata update: invalidate course draft/detail and instructor courses.
- After content change: invalidate course content and draft validation status.
- After publish/unpublish: invalidate public course list/detail, instructor courses, admin moderation lists.

## Failure handling

- Form validation errors shown inline.
- Upload errors preserve form state.
- Publish errors return missing requirements.
- Partial content updates must be retryable.
- Editor should not lose draft data on refresh because draft is backend-persisted.

## State rule

The entire course draft must not live in global frontend state. The backend owns the draft; TanStack Query reads it; React Hook Form owns currently edited form fields; local state owns UI controls.
