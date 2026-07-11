//const { instance } = require("../config/razorpay")
const { getRazorpayInstance } = require("../config/razorpay");

const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const enrollmentService = require("../modules/enrollments/enrollment.service")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.error("Payment course validation failed:", error.message)
      return res.status(500).json({ success: false, message: "Could not validate course payment" })
    }
  }

   // 🎯 If the course is FREE, enroll directly (no Razorpay)
  if (total_amount === 0) {
    try {
      await enrollStudents(courses, userId);
      return res.status(200).json({
        success: true,
        message: "Enrolled successfully in free course(s)",
        freeCourse: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Enrollment failed" });
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    //const paymentResponse = await instance.orders.create(options)
    const razorpay = getRazorpayInstance();
    const paymentResponse = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.error("Payment order creation failed:", error.message)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.error("Payment success email failed:", error.message)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// Deprecated payment bridge: enrollment writes are owned by enrollmentService.
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Course ID and user ID are required")
  }

  for (const courseId of courses) {
    await enrollmentService.enrollStudent(userId, courseId, { sendEmail: true })
  }
}
