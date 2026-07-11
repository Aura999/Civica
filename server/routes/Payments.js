// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
const validate = require("../middleware/validate")
const {
  capturePaymentSchema,
  verifyPaymentSchema,
  paymentSuccessEmailSchema,
} = require("../validations/payment.validation")

router.post("/capturePayment", auth, isStudent, validate(capturePaymentSchema), capturePayment)
router.post("/verifyPayment", auth, isStudent, validate(verifyPaymentSchema), verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  validate(paymentSuccessEmailSchema),
  sendPaymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

module.exports = router
