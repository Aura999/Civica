# TARGET DATA MODEL DECISIONS

Schemas are not changed in Phase 2. This document freezes direction for later migrations.

## Model decisions

| Model | Decision | Target direction | Migration risk |
|---|---|---|---|
| User | Keep | Identity, auth role, approval status, profile link. Remove enrollment/progress arrays after compatibility period. | High because current enrollment reads use `User.courses`. |
| Profile | Keep | Separate profile document is acceptable; can remain for low-risk migration. | Low. |
| Course | Keep | Own metadata, instructor, category, publish status, thumbnail/resource references, content hierarchy references. Remove pricing fields later. | Medium. |
| Section | Keep temporarily | Keep separate collection for 15-day safety; add ordering fields later. | Medium. |
| Subsection/Lesson | Replace name conceptually with Lesson, keep collection initially | Use Lesson terminology in UI/API; keep existing collection until migration is safe. | Medium. |
| Enrollment | Introduce | Single source of truth for student-course relationship and progress summary. | High but necessary. |
| CourseProgress | Deprecate into Enrollment | Move completed lessons, progress percentage, and last accessed lesson into Enrollment. | High because player and enrolled-course logic depend on it. |
| Review | Keep | One review per enrolled student per course, editable/deletable by owner. | Medium. |
| Category | Keep | Admin-managed categories; avoid duplicated course arrays long term. | Medium. |
| OTP | Keep with service-owned email | Retain TTL OTP collection; remove email side effect from model. | Medium. |
| AI document chunk | Introduce | Store course-scoped chunks and embeddings for RAG. | Medium. |

## Enrollment source of truth

Preferred target: dedicated `Enrollment` model.

```text
Enrollment
  student
  course
  completedLessons
  progressPercentage
  lastAccessedLesson
  enrolledAt
  completedAt
  status
```

Rules:

- `Enrollment` is the single source of truth for whether a student can access a course.
- `completedLessons`, `progressPercentage`, and `lastAccessedLesson` belong to `Enrollment`.
- `User.courses`, `Course.studentsEnroled`, `User.courseProgress`, and `CourseProgress` may remain temporarily for backward compatibility during migration.
- New code should read from `Enrollment` once the module exists.
- Compatibility arrays should be written only by a compatibility service and removed after all reads migrate.

## Duplicated legacy relationship

Current duplication:

- `User.courses`
- `Course.studentsEnroled`
- `User.courseProgress`
- `CourseProgress`

Decision:

- Introduce `Enrollment` first.
- During migration, write `Enrollment` and optionally mirror legacy arrays for old UI compatibility.
- Move reads to `Enrollment`.
- Stop writing legacy arrays.
- Remove/deprecate arrays only after data migration and tests.

## Sections and lessons: separate or embedded

Decision for 15-day scope: keep separate collections temporarily.

Reasoning:

- Existing code already expects separate `Section` and `SubSection` documents.
- Embedding would require broad read/write/player/progress migration.
- The safer near-term improvement is to add service-layer ownership, ordering, and validation around existing collections.
- Later, embedding may be reconsidered if course content is always loaded as a whole and progress has stable lesson identifiers.

## AI document chunk model

Introduce:

```text
AiDocumentChunk
  courseId
  sourceId
  sourceName
  pageNumber
  chunkIndex
  text
  embedding
  createdAt
```

Rules:

- Must index by `courseId`.
- Retrieval must filter by `courseId`.
- Source metadata must be retained for citations.
- Deleting a course or source must delete associated chunks.

## Migration safety principles

- Do not rename legacy fields until reads and writes are isolated behind services.
- Do not delete `CourseProgress` until player and enrolled-course progress reads use `Enrollment`.
- Do not remove payment code until enrollment is service-owned.
- Do not change section/lesson storage and enrollment storage in the same implementation phase.
