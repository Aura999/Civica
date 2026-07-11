// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course")

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingandReview")
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress")
// Importing Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
  authorizeRoles,
} = require("../middleware/auth")
const validate = require("../middleware/validate")
const {
  requireCourseOwner,
  requireSectionCourseOwner,
  requireSubSectionCourseOwner,
  requireCourseEnrollment,
  requireFullCourseAccess,
} = require("../utils/ownership")
const {
  createCourseSchema,
  editCourseSchema,
  courseIdBodySchema,
  createSectionSchema,
  updateSectionSchema,
  deleteSectionSchema,
  createSubSectionSchema,
  updateSubSectionSchema,
  deleteSubSectionSchema,
  updateCourseProgressSchema,
} = require("../validations/course.validation")
const {
  createCategorySchema,
  categoryPageDetailsSchema,
} = require("../validations/category.validation")
const { createRatingSchema } = require("../validations/review.validation")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, validate(createCourseSchema), createCourse)
// Edit Course routes
router.post(
  "/editCourse",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(editCourseSchema),
  requireCourseOwner(),
  editCourse
)
//Add a Section to a Course
router.post(
  "/addSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(createSectionSchema),
  requireSectionCourseOwner({ getSectionId: () => null }),
  createSection
)
// Update a Section
router.post(
  "/updateSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(updateSectionSchema),
  requireSectionCourseOwner(),
  updateSection
)
// Delete a Section
router.post(
  "/deleteSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(deleteSectionSchema),
  requireSectionCourseOwner(),
  deleteSection
)
// Edit Sub Section
router.post(
  "/updateSubSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(updateSubSectionSchema),
  requireSubSectionCourseOwner(),
  updateSubSection
)
// Delete Sub Section
router.post(
  "/deleteSubSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(deleteSubSectionSchema),
  requireSubSectionCourseOwner(),
  deleteSubSection
)
// Add a Sub Section to a Section
router.post(
  "/addSubSection",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(createSubSectionSchema),
  requireSubSectionCourseOwner({ getSubSectionId: () => null }),
  createSubSection
)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", validate(courseIdBodySchema), getCourseDetails)
// Get Details for a Specific Courses
router.post(
  "/getFullCourseDetails",
  auth,
  validate(courseIdBodySchema),
  requireFullCourseAccess(),
  getFullCourseDetails
)
// To Update Course Progress
router.post(
  "/updateCourseProgress",
  auth,
  isStudent,
  validate(updateCourseProgressSchema),
  requireCourseEnrollment(),
  updateCourseProgress
)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete(
  "/deleteCourse",
  auth,
  authorizeRoles("Instructor", "Admin"),
  validate(courseIdBodySchema),
  requireCourseOwner(),
  deleteCourse
)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, validate(createCategorySchema), createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", validate(categoryPageDetailsSchema), categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post(
  "/createRating",
  auth,
  isStudent,
  validate(createRatingSchema),
  requireCourseEnrollment(),
  createRating
)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router
