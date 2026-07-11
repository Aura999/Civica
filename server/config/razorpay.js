require("dotenv").config()

const Razorpay = require("razorpay")

function getRazorpayInstance() {
  const key = process.env.RAZORPAY_KEY
  const secret = process.env.RAZORPAY_SECRET

  if (!key || !secret) {
    console.error("Razorpay credentials are missing")
    throw new Error("Razorpay keys are not set in environment variables")
  }

  console.log("Razorpay instance created")
  return new Razorpay({
    key_id: key,
    key_secret: secret,
  })
}

module.exports = { getRazorpayInstance }
