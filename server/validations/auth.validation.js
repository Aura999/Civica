const { z, email, password, nonEmptyString } = require("./common.validation")

const signupSchema = z
  .object({
    body: z
      .object({
        firstName: nonEmptyString,
        lastName: nonEmptyString,
        email,
        password,
        confirmPassword: password,
        accountType: z.enum(["Student", "Instructor", "Admin"]).optional(),
        contactNumber: z.string().trim().optional(),
        otp: z.string().trim().min(4).max(10),
      })
      .strict()
      .refine((data) => data.password === data.confirmPassword, {
        message: "Password and confirm password do not match",
        path: ["confirmPassword"],
      }),
  })
  .passthrough()

const loginSchema = z
  .object({
    body: z.object({ email, password }).strict(),
  })
  .passthrough()

const sendOtpSchema = z
  .object({
    body: z.object({ email }).strict(),
  })
  .passthrough()

const changePasswordSchema = z
  .object({
    body: z
      .object({
        oldPassword: password,
        newPassword: password,
      })
      .strict(),
  })
  .passthrough()

const resetPasswordTokenSchema = z
  .object({
    body: z.object({ email }).strict(),
  })
  .passthrough()

const resetPasswordSchema = z
  .object({
    body: z
      .object({
        password,
        confirmPassword: password,
        token: nonEmptyString,
      })
      .strict()
      .refine((data) => data.password === data.confirmPassword, {
        message: "Password and confirm password do not match",
        path: ["confirmPassword"],
      }),
  })
  .passthrough()

module.exports = {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  changePasswordSchema,
  resetPasswordTokenSchema,
  resetPasswordSchema,
}
