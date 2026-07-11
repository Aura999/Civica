const jwt = require("jsonwebtoken")
const User = require("../models/User")

const getTokenFromRequest = (req) => {
  const authHeader = req.header("Authorization")

  if (req.cookies?.token) {
    return req.cookies.token
  }

  if (req.body?.token) {
    return req.body.token
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "")
  }

  return null
}

exports.auth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = {
        ...decoded,
        id: decoded.id || decoded._id,
        role: decoded.role || decoded.accountType,
      }
      return next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      })
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    })
  }
}

exports.authorizeRoles = (...allowedRoles) => async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id).select(
      "email accountType approved"
    )

    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      })
    }

    if (!allowedRoles.includes(userDetails.accountType)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route",
      })
    }

    if (
      userDetails.accountType === "Instructor" &&
      userDetails.approved === false
    ) {
      return res.status(403).json({
        success: false,
        message: "Instructor account is pending approval",
      })
    }

    req.user.accountType = userDetails.accountType
    req.user.approved = userDetails.approved
    return next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}

exports.isStudent = exports.authorizeRoles("Student")
exports.isAdmin = exports.authorizeRoles("Admin")
exports.isInstructor = exports.authorizeRoles("Instructor")
