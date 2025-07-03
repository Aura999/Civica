require("dotenv").config();

const Razorpay = require("razorpay");

exports.instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY,
	key_secret: process.env.RAZORPAY_SECRET,
});

console.log("razpay key --> ",process.env.RAZORPAY_KEY)
console.log("razpay secret --> ",process.env.RAZORPAY_SECRET)
