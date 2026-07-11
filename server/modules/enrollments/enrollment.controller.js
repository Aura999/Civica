const asyncHandler = require("../../utils/asyncHandler")
const ApiResponse = require("../../utils/ApiResponse")
const enrollmentService = require("./enrollment.service")

exports.enrollStudent = asyncHandler(async (req, res) => {
  const result = await enrollmentService.enrollStudent(
    req.user.id,
    req.params.courseId
  )

  return res.status(200).json(
    new ApiResponse(
      result.alreadyEnrolled ? "Already enrolled" : "Enrolled successfully",
      {
        enrollment: result.enrollment,
        courseAccessGranted: result.courseAccessGranted,
      }
    )
  )
})

exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getMyEnrollments(req.user.id, {
    page: req.query.page,
    limit: req.query.limit,
  })

  return res
    .status(200)
    .json(new ApiResponse("Enrollments fetched successfully", { enrollments }))
})

exports.getCourseEnrollment = asyncHandler(async (req, res) => {
  const result = await enrollmentService.getCourseEnrollment(
    req.user.id,
    req.params.courseId
  )

  return res
    .status(200)
    .json(new ApiResponse("Enrollment status fetched successfully", result))
})

exports.getCourseStudents = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getCourseStudents(
    req.params.courseId,
    req.user.id,
    {
      page: req.query.page,
      limit: req.query.limit,
    }
  )

  return res
    .status(200)
    .json(new ApiResponse("Course enrollments fetched successfully", { enrollments }))
})
