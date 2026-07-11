const { z, objectId, nonEmptyString } = require("./common.validation")

const createCategorySchema = z
  .object({
    body: z
      .object({
        name: nonEmptyString,
        description: nonEmptyString,
      })
      .strict(),
  })
  .passthrough()

const categoryPageDetailsSchema = z
  .object({
    body: z.object({ categoryId: objectId }).strict(),
  })
  .passthrough()

module.exports = { createCategorySchema, categoryPageDetailsSchema }
