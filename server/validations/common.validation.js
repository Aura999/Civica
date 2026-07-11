const { z } = require("zod")

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid resource identifier")
const email = z.string().trim().email("Invalid email address").toLowerCase()
const password = z.string().min(6, "Password must be at least 6 characters")
const nonEmptyString = z.string().trim().min(1, "This field is required")

module.exports = { z, objectId, email, password, nonEmptyString }
