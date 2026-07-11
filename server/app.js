const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const helmet = require("helmet")
const compression = require("compression")
const mongoose = require("mongoose")

const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const contactUsRoute = require("./routes/Contact")
const ApiError = require("./utils/ApiError")
const ApiResponse = require("./utils/ApiResponse")
const { getAllowedOrigins } = require("./config/env")
const notFound = require("./middleware/notFound")
const errorHandler = require("./middleware/errorHandler")

const app = express()

app.use(helmet())
app.use(compression())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(cookieParser())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || getAllowedOrigins().includes(origin)) {
        return callback(null, true)
      }
      return callback(new ApiError(403, "CORS origin not allowed"))
    },
    credentials: true,
  })
)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 500 * 1024 * 1024 },
  })
)

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/reach", contactUsRoute)

app.get("/api/health", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }

  return res.status(200).json(
    new ApiResponse("CIVICA API is healthy", {
      status: "ok",
      database: states[mongoose.connection.readyState] || "unknown",
      timestamp: new Date().toISOString(),
    })
  )
})

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  })
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
