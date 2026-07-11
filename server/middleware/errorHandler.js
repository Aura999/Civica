const ApiError = require("../utils/ApiError")

const mapError = (err) => {
  if (err instanceof ApiError) {
    return err
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((item) => ({
      path: item.path,
      message: item.message,
    }))
    return new ApiError(400, "Validation failed", errors)
  }

  if (err.name === "CastError") {
    return new ApiError(400, "Invalid resource identifier")
  }

  if (err.code === 11000) {
    return new ApiError(409, "Duplicate resource", Object.keys(err.keyValue || {}))
  }

  return new ApiError(err.statusCode || 500, err.message || "Internal server error")
}

const errorHandler = (err, req, res, next) => {
  const safeError = mapError(err)
  const statusCode = safeError.statusCode || 500
  const message =
    statusCode >= 500 ? "Internal server error" : safeError.message

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack || err.message)
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: safeError.errors || [],
  })
}

module.exports = errorHandler
