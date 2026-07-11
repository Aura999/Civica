const express = require("express")
const { auth, isStudent, authorizeRoles } = require("../../middleware/auth")
const validate = require("../../middleware/validate")
const {
  courseIdParamSchema,
  paginationSchema,
  courseStudentsSchema,
} = require("./enrollment.validation")
const controller = require("./enrollment.controller")

const router = express.Router()

router.post(
  "/:courseId",
  auth,
  isStudent,
  validate(courseIdParamSchema),
  controller.enrollStudent
)

router.get(
  "/me",
  auth,
  isStudent,
  validate(paginationSchema),
  controller.getMyEnrollments
)

router.get(
  "/course/:courseId",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(courseStudentsSchema),
  controller.getCourseStudents
)

router.get(
  "/:courseId",
  auth,
  validate(courseIdParamSchema),
  controller.getCourseEnrollment
)

module.exports = router
