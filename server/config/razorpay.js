require("dotenv").config();

const Razorpay = require("razorpay");

// exports.instance = new Razorpay({
// 	key_id: process.env.RAZORPAY_KEY,
// 	key_secret: process.env.RAZORPAY_SECRET,
// });

// console.log("razpay key --> ",process.env.RAZORPAY_KEY)
// console.log("razpay secret --> ",process.env.RAZORPAY_SECRET)

function getRazorpayInstance() {
  const key = process.env.RAZORPAY_KEY;
  const secret = process.env.RAZORPAY_SECRET;

  if (!key || !secret) {
    console.error(" RAZORPAY_KEY or RAZORPAY_SECRET is missing");
    throw new Error("Razorpay keys are not set in environment variables");
  }

  console.log("✅ Razorpay instance created");
  return new Razorpay({
    key_id: key,
    key_secret: secret,
  });
}

module.exports = { getRazorpayInstance };
