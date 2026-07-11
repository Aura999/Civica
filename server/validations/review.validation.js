const { z, objectId, nonEmptyString } = require("./common.validation")

const createRatingSchema = z
  .object({
    body: z
      .object({
        courseId: objectId,
        rating: z.coerce.number().min(1).max(5),
        review: nonEmptyString.max(1000),
      })
      .strict(),
  })
  .passthrough()

module.exports = { createRatingSchema }
