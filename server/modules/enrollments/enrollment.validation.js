const { z, objectId } = require("../../validations/common.validation")

const courseIdParamSchema = z
  .object({
    params: z.object({ courseId: objectId }).strict(),
  })
  .passthrough()

const paginationSchema = z
  .object({
    query: z
      .object({
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().max(100).optional(),
      })
      .strict(),
  })
  .passthrough()

const courseStudentsSchema = z
  .object({
    params: z.object({ courseId: objectId }).strict(),
    query: paginationSchema.shape.query,
  })
  .passthrough()

module.exports = {
  courseIdParamSchema,
  paginationSchema,
  courseStudentsSchema,
}
