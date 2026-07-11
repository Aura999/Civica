const { z, objectId, nonEmptyString } = require("./common.validation")

const capturePaymentSchema = z
  .object({
    body: z.object({ courses: z.array(objectId).min(1) }).strict(),
  })
  .passthrough()

const verifyPaymentSchema = z
  .object({
    body: z
      .object({
        razorpay_order_id: nonEmptyString,
        razorpay_payment_id: nonEmptyString,
        razorpay_signature: nonEmptyString,
        courses: z.array(objectId).min(1),
      })
      .strict(),
  })
  .passthrough()

const paymentSuccessEmailSchema = z
  .object({
    body: z
      .object({
        orderId: nonEmptyString,
        paymentId: nonEmptyString,
        amount: z.coerce.number().nonnegative(),
      })
      .strict(),
  })
  .passthrough()

module.exports = {
  capturePaymentSchema,
  verifyPaymentSchema,
  paymentSuccessEmailSchema,
}
