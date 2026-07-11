const { z, objectId, nonEmptyString } = require("./common.validation")

const createCourseSchema = z
  .object({
    body: z
      .object({
        courseName: nonEmptyString,
        courseDescription: nonEmptyString,
        whatYouWillLearn: nonEmptyString,
        price: z.union([z.string().trim().min(1), z.number().nonnegative()]),
        category: objectId,
        status: z.enum(["Draft", "Published"]).optional(),
        instructions: nonEmptyString,
      })
      .passthrough(),
  })
  .passthrough()

const editCourseSchema = z
  .object({
    body: z
      .object({
        courseId: objectId,
        courseName: nonEmptyString.optional(),
        courseDescription: nonEmptyString.optional(),
        whatYouWillLearn: nonEmptyString.optional(),
        price: z.union([z.string().trim().min(1), z.number().nonnegative()]).optional(),
        category: objectId.optional(),
        status: z.enum(["Draft", "Published"]).optional(),
        instructions: nonEmptyString.optional(),
      })
      .passthrough(),
  })
  .passthrough()

const courseIdBodySchema = z
  .object({
    body: z.object({ courseId: objectId }).passthrough(),
  })
  .passthrough()

const createSectionSchema = z
  .object({
    body: z.object({ sectionName: nonEmptyString, courseId: objectId }).strict(),
  })
  .passthrough()

const updateSectionSchema = z
  .object({
    body: z
      .object({
        sectionName: nonEmptyString,
        sectionId: objectId,
        courseId: objectId,
      })
      .strict(),
  })
  .passthrough()

const deleteSectionSchema = z
  .object({
    body: z.object({ sectionId: objectId, courseId: objectId }).strict(),
  })
  .passthrough()

const createSubSectionSchema = z
  .object({
    body: z
      .object({
        sectionId: objectId,
        title: nonEmptyString,
        description: nonEmptyString,
      })
      .passthrough(),
  })
  .passthrough()

const updateSubSectionSchema = z
  .object({
    body: z
      .object({
        sectionId: objectId,
        subSectionId: objectId,
        title: nonEmptyString.optional(),
        description: nonEmptyString.optional(),
      })
      .passthrough(),
  })
  .passthrough()

const deleteSubSectionSchema = z
  .object({
    body: z.object({ sectionId: objectId, subSectionId: objectId }).strict(),
  })
  .passthrough()

const updateCourseProgressSchema = z
  .object({
    body: z.object({ courseId: objectId, subsectionId: objectId }).strict(),
  })
  .passthrough()

module.exports = {
  createCourseSchema,
  editCourseSchema,
  courseIdBodySchema,
  createSectionSchema,
  updateSectionSchema,
  deleteSectionSchema,
  createSubSectionSchema,
  updateSubSectionSchema,
  deleteSubSectionSchema,
  updateCourseProgressSchema,
}
