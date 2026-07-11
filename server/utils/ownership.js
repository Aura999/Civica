const Course = require("../models/Course")
const Section = require("../models/Section")
const User = require("../models/User")
const CourseProgress = require("../models/CourseProgress")
const ApiError = require("./ApiError")
const asyncHandler = require("./asyncHandler")

const getAuthenticatedUser = async (req) => {
  const user = await User.findById(req.user.id).select("accountType approved")
  if (!user) {
    throw new ApiError(401, "Authenticated user not found")
  }
  return user
}

const assertInstructorApproved = (user) => {
  if (user.accountType === "Instructor" && user.approved === false) {
    throw new ApiError(403, "Instructor account is pending approval")
  }
}

const requireCourseOwner = (getCourseId = (req) => req.body.courseId) =>
  asyncHandler(async (req, res, next) => {
    const courseId = getCourseId(req)
    const course = await Course.findById(courseId)

    if (!course) {
      throw new ApiError(404, "Course not found")
    }

    const user = await getAuthenticatedUser(req)
    if (user.accountType === "Admin") {
      req.course = course
      return next()
    }

    assertInstructorApproved(user)

    if (String(course.instructor) !== String(req.user.id)) {
      throw new ApiError(403, "You are not authorized to modify this course")
    }

    req.course = course
    return next()
  })

const requireSectionCourseOwner = ({
  getCourseId = (req) => req.body.courseId,
  getSectionId = (req) => req.body.sectionId,
} = {}) =>
  asyncHandler(async (req, res, next) => {
    const courseId = getCourseId(req)
    const sectionId = getSectionId(req)
    const course = await Course.findById(courseId)

    if (!course) {
      throw new ApiError(404, "Course not found")
    }

    if (sectionId && !course.courseContent.map(String).includes(String(sectionId))) {
      throw new ApiError(404, "Section not found for this course")
    }

    const user = await getAuthenticatedUser(req)
    if (user.accountType === "Admin") {
      req.course = course
      return next()
    }

    assertInstructorApproved(user)

    if (String(course.instructor) !== String(req.user.id)) {
      throw new ApiError(403, "You are not authorized to modify this course")
    }

    req.course = course
    return next()
  })

const requireSubSectionCourseOwner = ({
  getSectionId = (req) => req.body.sectionId,
  getSubSectionId = (req) => req.body.subSectionId,
} = {}) =>
  asyncHandler(async (req, res, next) => {
    const sectionId = getSectionId(req)
    const subSectionId = getSubSectionId(req)
    const section = await Section.findById(sectionId)

    if (!section) {
      throw new ApiError(404, "Section not found")
    }

    if (subSectionId && !section.subSection.map(String).includes(String(subSectionId))) {
      throw new ApiError(404, "Subsection not found for this section")
    }

    const course = await Course.findOne({ courseContent: sectionId })
    if (!course) {
      throw new ApiError(404, "Parent course not found")
    }

    const user = await getAuthenticatedUser(req)
    if (user.accountType === "Admin") {
      req.course = course
      req.section = section
      return next()
    }

    assertInstructorApproved(user)

    if (String(course.instructor) !== String(req.user.id)) {
      throw new ApiError(403, "You are not authorized to modify this course")
    }

    req.course = course
    req.section = section
    return next()
  })

const requireCourseEnrollment = (getCourseId = (req) => req.body.courseId) =>
  asyncHandler(async (req, res, next) => {
    const courseId = getCourseId(req)
    const course = await Course.findById(courseId).select("studentsEnroled")
    if (!course) {
      throw new ApiError(404, "Course not found")
    }

    const isEnrolled = course.studentsEnroled.map(String).includes(String(req.user.id))
    const hasProgress = await CourseProgress.exists({
      courseID: courseId,
      userId: req.user.id,
    })

    if (!isEnrolled && !hasProgress) {
      throw new ApiError(403, "Enrollment is required for this action")
    }

    return next()
  })

const requireFullCourseAccess = (getCourseId = (req) => req.body.courseId) =>
  asyncHandler(async (req, res, next) => {
    const courseId = getCourseId(req)
    const course = await Course.findById(courseId).select("instructor studentsEnroled")
    if (!course) {
      throw new ApiError(404, "Course not found")
    }

    const user = await getAuthenticatedUser(req)
    if (user.accountType === "Admin") {
      return next()
    }

    if (user.accountType === "Instructor") {
      assertInstructorApproved(user)
      if (String(course.instructor) === String(req.user.id)) {
        return next()
      }
    }

    if (user.accountType === "Student") {
      const isEnrolled = course.studentsEnroled.map(String).includes(String(req.user.id))
      const hasProgress = await CourseProgress.exists({
        courseID: courseId,
        userId: req.user.id,
      })
      if (isEnrolled || hasProgress) {
        return next()
      }
    }

    throw new ApiError(403, "You are not authorized to access this course content")
  })

module.exports = {
  requireCourseOwner,
  requireSectionCourseOwner,
  requireSubSectionCourseOwner,
  requireCourseEnrollment,
  requireFullCourseAccess,
}
