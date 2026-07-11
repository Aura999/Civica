// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { authRateLimiter } = require("../middleware/rateLimiters")
const {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  changePasswordSchema,
  resetPasswordTokenSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", authRateLimiter, validate(loginSchema), login)

// Route for user signup
router.post("/signup", authRateLimiter, validate(signupSchema), signup)

// Route for sending OTP to the user's email
router.post("/sendotp", authRateLimiter, validate(sendOtpSchema), sendotp)

// Route for Changing the password
router.post("/changepassword", auth, validate(changePasswordSchema), changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post(
  "/reset-password-token",
  authRateLimiter,
  validate(resetPasswordTokenSchema),
  resetPasswordToken
)

// Route for resetting user's password after verification
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPassword)

// Export the router for use in the main application
module.exports = router
