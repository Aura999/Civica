const mongoose = require("mongoose")
const Course = require("../../models/Course")
const User = require("../../models/User")
const CourseProgress = require("../../models/CourseProgress")
const Enrollment = require("../../models/Enrollment")
const ApiError = require("../../utils/ApiError")
const mailSender = require("../../utils/mailSender")
const {
  courseEnrollmentEmail,
} = require("../../mail/templates/courseEnrollmentEmail")

const ACCESS_GRANTING_STATUSES = ["active", "completed"]

const loadCourseCurriculum = async (courseId, session) => {
  const course = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: { path: "subSection", select: "_id" },
    })
    .session(session || null)

  if (!course) {
    throw new ApiError(404, "Course not found")
  }

  const validLessonIds = new Set()
  course.courseContent.forEach((section) => {
    ;(section.subSection || []).forEach((lesson) => {
      validLessonIds.add(String(lesson._id))
    })
  })

  return { course, totalLessons: validLessonIds.size, validLessonIds }
}

const getExistingEnrollment = async (studentId, courseId, session) =>
  Enrollment.findOne({ student: studentId, course: courseId }).session(
    session || null
  )

const syncLegacyEnrollment = async (studentId, courseId, session) => {
  let courseProgress = await CourseProgress.findOne({
    courseID: courseId,
    userId: studentId,
  }).session(session || null)

  if (!courseProgress) {
    courseProgress = await CourseProgress.create(
      [
        {
          courseID: courseId,
          userId: studentId,
          completedVideos: [],
        },
      ],
      { session }
    ).then((records) => records[0])
  }

  await Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { studentsEnroled: studentId } },
    { session }
  )

  await User.findByIdAndUpdate(
    studentId,
    {
      $addToSet: {
        courses: courseId,
        courseProgress: courseProgress._id,
      },
    },
    { session }
  )

  return courseProgress
}

const createEnrollmentRecord = async (studentId, courseId, session) => {
  try {
    const records = await Enrollment.create(
      [
        {
          student: studentId,
          course: courseId,
          completedLessons: [],
          progressPercentage: 0,
          lastAccessedLesson: null,
          status: "active",
        },
      ],
      { session }
    )
    return records[0]
  } catch (error) {
    if (error.code === 11000) {
      return getExistingEnrollment(studentId, courseId, session)
    }
    throw error
  }
}

const runEnrollmentWrites = async (operation) => {
  const session = await mongoose.startSession()
  try {
    let result
    await session.withTransaction(async () => {
      result = await operation(session)
    })
    return result
  } catch (error) {
    const unsupportedTransaction =
      error.message?.includes("Transaction numbers are only allowed") ||
      error.message?.includes("replica set member or mongos")

    if (!unsupportedTransaction) {
      throw error
    }

    return operation(null)
  } finally {
    session.endSession()
  }
}

const sendEnrollmentEmail = async (student, course) => {
  try {
    const response = await mailSender(
      student.email,
      `Successfully Enrolled into ${course.courseName}`,
      courseEnrollmentEmail(
        course.courseName,
        `${student.firstName} ${student.lastName}`
      )
    )
    if (response?.success === false) {
      console.error("Enrollment email failed")
      return
    }
    console.log("Enrollment email sent")
  } catch (error) {
    console.error("Enrollment email failed:", error.message)
  }
}

const migrateLegacyEnrollment = async (studentId, courseId, session) => {
  const existing = await getExistingEnrollment(studentId, courseId, session)
  if (existing) {
    return existing
  }

  const [course, user, courseProgress] = await Promise.all([
    Course.findById(courseId).select("studentsEnroled").session(session || null),
    User.findById(studentId).select("courses").session(session || null),
    CourseProgress.findOne({ courseID: courseId, userId: studentId }).session(
      session || null
    ),
  ])

  if (!course) {
    throw new ApiError(404, "Course not found")
  }

  const hasLegacyCourse =
    course.studentsEnroled.map(String).includes(String(studentId)) ||
    user?.courses?.map(String).includes(String(courseId)) ||
    Boolean(courseProgress)

  if (!hasLegacyCourse) {
    return null
  }

  const completedLessons = courseProgress?.completedVideos || []
  const { totalLessons } = await loadCourseCurriculum(courseId, session)
  const progressPercentage =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((completedLessons.length / totalLessons) * 10000) / 100
        )
      : 0

  const records = await Enrollment.create(
    [
      {
        student: studentId,
        course: courseId,
        completedLessons,
        progressPercentage,
        lastAccessedLesson: completedLessons[completedLessons.length - 1] || null,
        status:
          totalLessons > 0 && completedLessons.length >= totalLessons
            ? "completed"
            : "active",
        completedAt:
          totalLessons > 0 && completedLessons.length >= totalLessons
            ? new Date()
            : null,
      },
    ],
    { session }
  )

  console.log("Legacy enrollment migrated")
  return records[0]
}

const enrollStudent = async (studentId, courseId, options = {}) => {
  const student = await User.findById(studentId).select(
    "firstName lastName email accountType"
  )
  if (!student) {
    throw new ApiError(404, "Student not found")
  }

  if (student.accountType !== "Student") {
    throw new ApiError(403, "Only students can enroll")
  }

  const course = await Course.findById(courseId).select(
    "courseName instructor status"
  )
  if (!course) {
    throw new ApiError(404, "Course not found")
  }

  if (course.status !== "Published") {
    throw new ApiError(403, "Course is not available for enrollment")
  }

  if (String(course.instructor) === String(studentId)) {
    throw new ApiError(403, "Instructors cannot enroll in their own course")
  }

  const existing = await getExistingEnrollment(studentId, courseId)
  if (existing) {
    return {
      enrollment: existing,
      courseAccessGranted: true,
      alreadyEnrolled: true,
    }
  }

  const result = await runEnrollmentWrites(async (session) => {
    const enrollment =
      (await migrateLegacyEnrollment(studentId, courseId, session)) ||
      (await createEnrollmentRecord(studentId, courseId, session))

    await syncLegacyEnrollment(studentId, courseId, session)

    return {
      enrollment,
      courseAccessGranted: true,
      alreadyEnrolled: false,
    }
  })

  if (options.sendEmail) {
    await sendEnrollmentEmail(student, course)
  }

  return result
}

const assertEnrollment = async (studentId, courseId, session) => {
  const enrollment =
    (await getExistingEnrollment(studentId, courseId, session)) ||
    (session
      ? await migrateLegacyEnrollment(studentId, courseId, session)
      : await runEnrollmentWrites((transactionSession) =>
          migrateLegacyEnrollment(studentId, courseId, transactionSession)
        ))

  if (!enrollment || !ACCESS_GRANTING_STATUSES.includes(enrollment.status)) {
    throw new ApiError(403, "Enrollment is required for this action")
  }

  return enrollment
}

const getCourseEnrollment = async (userId, courseId) => {
  const [course, user] = await Promise.all([
    Course.findById(courseId).select("instructor"),
    User.findById(userId).select("accountType"),
  ])
  if (!course) {
    throw new ApiError(404, "Course not found")
  }

  const enrollment =
    user?.accountType === "Student"
      ? (await getExistingEnrollment(userId, courseId)) ||
        (await runEnrollmentWrites((session) =>
          migrateLegacyEnrollment(userId, courseId, session)
        ))
      : null

  return {
    enrolled: Boolean(enrollment),
    enrollment,
    courseAccessGranted:
      Boolean(enrollment) ||
      String(course.instructor) === String(userId) ||
      user?.accountType === "Admin",
  }
}

const migrateLegacyEnrollmentsForStudent = async (studentId) => {
  const [user, progressRecords] = await Promise.all([
    User.findById(studentId).select("courses"),
    CourseProgress.find({ userId: studentId }).select("courseID"),
  ])

  const courseIds = new Set([
    ...(user?.courses || []).map(String),
    ...progressRecords.map((record) => String(record.courseID)),
  ])

  for (const courseId of courseIds) {
    const existing = await getExistingEnrollment(studentId, courseId)
    if (!existing) {
      try {
        await runEnrollmentWrites((session) =>
          migrateLegacyEnrollment(studentId, courseId, session)
        )
      } catch (error) {
        if (error.statusCode === 404) {
          console.log("Skipped stale legacy enrollment reference")
        } else {
          throw error
        }
      }
    }
  }
}

const getMyEnrollments = async (studentId, { page = 1, limit = 50 } = {}) => {
  await migrateLegacyEnrollmentsForStudent(studentId)

  const skip = (page - 1) * limit
  const enrollments = await Enrollment.find({ student: studentId })
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "course",
      select:
        "courseName courseDescription thumbnail instructor price status courseContent ratingAndReviews studentsEnroled",
      populate: [
        {
          path: "instructor",
          select: "firstName lastName image",
        },
        {
          path: "courseContent",
          populate: { path: "subSection", select: "timeDuration" },
        },
      ],
    })

  return enrollments.filter((item) => item.course)
}

const getMyEnrolledCoursesForLegacyDashboard = async (studentId) => {
  const enrollments = await getMyEnrollments(studentId)

  return enrollments.map((enrollment) => {
    const course = enrollment.course.toObject()
    let totalLessons = 0
    let totalDurationInSeconds = 0

    course.courseContent?.forEach((section) => {
      totalLessons += section.subSection?.length || 0
      totalDurationInSeconds += (section.subSection || []).reduce(
        (total, subSection) => total + parseInt(subSection.timeDuration || 0),
        0
      )
    })

    course.progressPercentage =
      enrollment.progressPercentage ||
      (totalLessons > 0
        ? Math.round(
            (enrollment.completedLessons.length / totalLessons) * 10000
          ) / 100
        : 0)
    course.totalDuration = totalDurationInSeconds
    return course
  })
}

const getCourseStudents = async (courseId, requesterId, { page = 1, limit = 50 } = {}) => {
  const course = await Course.findById(courseId).select("instructor")
  if (!course) {
    throw new ApiError(404, "Course not found")
  }

  const requester = await User.findById(requesterId).select("accountType")
  if (
    requester?.accountType !== "Admin" &&
    String(course.instructor) !== String(requesterId)
  ) {
    throw new ApiError(403, "You are not authorized to view course enrollments")
  }

  return Enrollment.find({ course: courseId })
    .sort({ enrolledAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("student", "firstName lastName email image")
}

const markLessonComplete = async (studentId, courseId, lessonId) =>
  runEnrollmentWrites(async (session) => {
    const enrollment = await assertEnrollment(studentId, courseId, session)
    const { totalLessons, validLessonIds } = await loadCourseCurriculum(
      courseId,
      session
    )

    if (!validLessonIds.has(String(lessonId))) {
      throw new ApiError(400, "Lesson does not belong to this course")
    }

    if (!enrollment.completedLessons.map(String).includes(String(lessonId))) {
      enrollment.completedLessons.push(lessonId)
    }

    enrollment.lastAccessedLesson = lessonId
    enrollment.progressPercentage =
      totalLessons > 0
        ? Math.min(
            100,
            Math.round((enrollment.completedLessons.length / totalLessons) * 10000) /
              100
          )
        : 0

    if (totalLessons > 0 && enrollment.completedLessons.length >= totalLessons) {
      enrollment.status = "completed"
      enrollment.completedAt = enrollment.completedAt || new Date()
    }

    await enrollment.save({ session })

    const courseProgress = await syncLegacyEnrollment(studentId, courseId, session)
    await CourseProgress.findByIdAndUpdate(
      courseProgress._id,
      { $addToSet: { completedVideos: lessonId } },
      { session }
    )

    return enrollment
  })

module.exports = {
  enrollStudent,
  getMyEnrollments,
  getCourseEnrollment,
  assertEnrollment,
  getCourseStudents,
  getMyEnrolledCoursesForLegacyDashboard,
  markLessonComplete,
}
