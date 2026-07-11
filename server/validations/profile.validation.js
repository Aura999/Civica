const { z, nonEmptyString } = require("./common.validation")

const updateProfileSchema = z
  .object({
    body: z
      .object({
        firstName: nonEmptyString.optional(),
        lastName: nonEmptyString.optional(),
        dateOfBirth: z.string().trim().optional(),
        about: z.string().trim().max(1000).optional(),
        contactNumber: z.string().trim().optional(),
        gender: z.string().trim().optional(),
      })
      .strict(),
  })
  .passthrough()

module.exports = { updateProfileSchema }
