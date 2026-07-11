process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"

const request = require("supertest")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { MongoMemoryServer } = require("mongodb-memory-server")
const app = require("../app")
const User = require("../models/User")
const Profile = require("../models/Profile")
const Course = require("../models/Course")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Enrollment = require("../models/Enrollment")
const enrollmentService = require("../modules/enrollments/enrollment.service")
const axios = require("axios")

let mongoServer

const createProfile = () =>
  Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  })

const createUser = async (accountType = "Student") => {
  const profile = await createProfile()
  const user = await User.create({
    firstName: accountType,
    lastName: "User",
    email: `${accountType.toLowerCase()}-${Date.now()}-${Math.random()}@test.com`,
    password: "hashed-password",
    accountType,
    approved: true,
    additionalDetails: profile._id,
    image: "",
  })

  const token = jwt.sign(
    { id: user._id, email: user.email, accountType: user.accountType },
    process.env.JWT_SECRET
  )

  return { user, token }
}

const createCourse = async ({ instructor, status = "Published", price = 0 } = {}) =>
  Course.create({
    courseName: "Civic Basics",
    courseDescription: "A civic learning course",
    instructor,
    whatYouWillLearn: "Core civic concepts",
    price,
    thumbnail: "https://example.com/thumb.png",
    status,
    instructions: ["Watch lessons"],
  })

const createCourseWithLessons = async ({
  instructor,
  status = "Published",
  lessonCount = 1,
} = {}) => {
  const lessons = await Promise.all(
    Array.from({ length: lessonCount }).map((_, index) =>
      SubSection.create({
        title: `Lesson ${index + 1}`,
        timeDuration: "60",
        description: "Intro",
        videoUrl: "https://example.com/video.mp4",
      })
    )
  )
  const section = await Section.create({
    sectionName: "Section 1",
    subSection: lessons.map((lesson) => lesson._id),
  })
  const course = await createCourse({ instructor, status })
  course.courseContent.push(section._id)
  await course.save()
  return { course, section, lesson: lessons[0], lessons }
}

const createCourseWithLesson = createCourseWithLessons

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({})
    )
  )
})

describe("Phase 4 enrollments", () => {
  it("allows a student to enroll in a published course", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })

    const response = await request(app)
      .post(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.courseAccessGranted).toBe(true)
    expect(await Enrollment.countDocuments()).toBe(1)
  })

  it("treats duplicate enrollment as idempotent", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })

    await request(app)
      .post(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)
    const response = await request(app)
      .post(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Already enrolled")
    expect(await Enrollment.countDocuments()).toBe(1)
  })

  it("rejects non-student enrollment", async () => {
    const { user: instructor, token } = await createUser("Instructor")
    const course = await createCourse({ instructor: instructor._id })

    const response = await request(app)
      .post(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(403)
  })

  it("rejects unauthenticated enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const course = await createCourse({ instructor: instructor._id })

    const response = await request(app).post(`/api/enrollments/${course._id}`)

    expect(response.status).toBe(401)
  })

  it("returns 404 for a missing course", async () => {
    const { token } = await createUser("Student")

    const response = await request(app)
      .post("/api/enrollments/64f000000000000000000000")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it("rejects unpublished course enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id, status: "Draft" })

    const response = await request(app)
      .post(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(403)
  })

  it("returns current student enrollments", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    const response = await request(app)
      .get("/api/enrollments/me")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.enrollments).toHaveLength(1)
  })

  it("returns enrollment status for a course", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    const response = await request(app)
      .get(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.enrolled).toBe(true)
  })

  it("denies full course content without enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(403)
  })

  it("allows full course content with enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(200)
  })

  it("allows full course content for a completed enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({ instructor: instructor._id })
    await Enrollment.create({
      student: student._id,
      course: course._id,
      completedLessons: [lesson._id],
      progressPercentage: 100,
      lastAccessedLesson: lesson._id,
      status: "completed",
      completedAt: new Date(),
    })

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(200)
  })

  it("denies full course content to an unrelated instructor", async () => {
    const { user: owner } = await createUser("Instructor")
    const { token } = await createUser("Instructor")
    const { course } = await createCourseWithLesson({ instructor: owner._id })

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(403)
  })

  it("allows full course content to the course owner", async () => {
    const { user: instructor, token } = await createUser("Instructor")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(200)
  })

  it("allows full course content to an admin", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Admin")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })

    const response = await request(app)
      .post("/api/v1/course/getFullCourseDetails")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString() })

    expect(response.status).toBe(200)
  })

  it("denies progress update without enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({
      instructor: instructor._id,
    })

    const response = await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })

    expect(response.status).toBe(403)
  })

  it("denies review creation without enrollment", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })

    const response = await request(app)
      .post("/api/v1/course/createRating")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), rating: 5, review: "Great course" })

    expect(response.status).toBe(403)
  })

  it("marks a valid course lesson complete", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    const response = await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })

    const enrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    })
    const courseProgress = await CourseProgress.findOne({
      userId: student._id,
      courseID: course._id,
    })

    expect(response.status).toBe(200)
    expect(enrollment.completedLessons.map(String)).toContain(String(lesson._id))
    expect(courseProgress.completedVideos.map(String)).toContain(String(lesson._id))
  })

  it("rejects a lesson from another course without modifying progress", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })
    const { lesson: foreignLesson } = await createCourseWithLesson({
      instructor: instructor._id,
    })
    await enrollmentService.enrollStudent(student._id, course._id)

    const response = await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseId: course._id.toString(),
        subsectionId: foreignLesson._id.toString(),
      })

    const enrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    })
    const courseProgress = await CourseProgress.findOne({
      userId: student._id,
      courseID: course._id,
    })

    expect(response.status).toBe(400)
    expect(enrollment.completedLessons).toHaveLength(0)
    expect(enrollment.progressPercentage).toBe(0)
    expect(enrollment.lastAccessedLesson).toBeNull()
    expect(courseProgress.completedVideos).toHaveLength(0)
  })

  it("rejects a nonexistent lesson without modifying progress", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)
    const missingLessonId = new mongoose.Types.ObjectId().toString()

    const response = await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: missingLessonId })

    const enrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    })

    expect(response.status).toBe(404)
    expect(enrollment.completedLessons).toHaveLength(0)
    expect(enrollment.progressPercentage).toBe(0)
  })

  it("keeps duplicate lesson completion idempotent and progress at or below 100", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })
    await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })

    const enrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    })
    const courseProgress = await CourseProgress.findOne({
      userId: student._id,
      courseID: course._id,
    })

    expect(enrollment.completedLessons).toHaveLength(1)
    expect(enrollment.progressPercentage).toBeLessThanOrEqual(100)
    expect(enrollment.status).toBe("completed")
    expect(enrollment.completedAt).toBeTruthy()
    expect(courseProgress.completedVideos).toHaveLength(1)
  })

  it("retains completed status on repeated completion requests", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)

    await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })
    const first = await Enrollment.findOne({ student: student._id, course: course._id })

    await request(app)
      .post("/api/v1/course/updateCourseProgress")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: course._id.toString(), subsectionId: lesson._id.toString() })
    const second = await Enrollment.findOne({ student: student._id, course: course._id })

    expect(second.status).toBe("completed")
    expect(second.completedAt.toISOString()).toBe(first.completedAt.toISOString())
  })

  it("does not start nested transactions during lesson completion", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student } = await createUser("Student")
    const { course, lesson } = await createCourseWithLesson({ instructor: instructor._id })
    await enrollmentService.enrollStudent(student._id, course._id)
    const originalStartSession = mongoose.startSession
    let startSessionCount = 0
    mongoose.startSession = async (...args) => {
      startSessionCount += 1
      return originalStartSession.apply(mongoose, args)
    }

    try {
      await enrollmentService.markLessonComplete(student._id, course._id, lesson._id)
    } finally {
      mongoose.startSession = originalStartSession
    }

    expect(startSessionCount).toBe(1)
  })

  it("does not undo enrollment when enrollment email delivery fails", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })
    const originalPost = axios.post
    axios.post = async () => {
      throw new Error("mail unavailable")
    }

    try {
      await enrollmentService.enrollStudent(student._id, course._id, {
        sendEmail: true,
      })
    } finally {
      axios.post = originalPost
    }

    expect(
      await Enrollment.exists({ student: student._id, course: course._id })
    ).toBeTruthy()
  })

  it("payment free-course path reuses enrollment state", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id, price: 0 })

    const response = await request(app)
      .post("/api/v1/payment/capturePayment")
      .set("Authorization", `Bearer ${token}`)
      .send({ courses: [course._id.toString()] })

    expect(response.status).toBe(200)
    expect(response.body.freeCourse).toBe(true)
    expect(await Enrollment.countDocuments({ course: course._id })).toBe(1)
  })

  it("lazily migrates valid legacy enrollment evidence", async () => {
    const { user: instructor } = await createUser("Instructor")
    const { user: student, token } = await createUser("Student")
    const course = await createCourse({ instructor: instructor._id })
    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { studentsEnroled: student._id },
    })
    await CourseProgress.create({
      courseID: course._id,
      userId: student._id,
      completedVideos: [],
    })

    const response = await request(app)
      .get(`/api/enrollments/${course._id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.enrolled).toBe(true)
    expect(await Enrollment.countDocuments()).toBe(1)
  })
})
