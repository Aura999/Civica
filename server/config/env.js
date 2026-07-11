const requiredEnv = [
  "MONGODB_URL",
  "JWT_SECRET",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
  "RESEND_API_KEY",
]

const optionalEnv = [
  "PORT",
  "FRONTEND_URL",
  "PRODUCTION_FRONTEND_URL",
  "RAZORPAY_KEY",
  "RAZORPAY_SECRET",
  "FOLDER_NAME",
  "MAIL_HOST",
  "MAIL_USER",
  "MAIL_PASS",
]

const validateEnv = () => {
  const missing = requiredEnv.filter((name) => !process.env[name])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return {
    required: requiredEnv,
    optional: optionalEnv,
  }
}

const getAllowedOrigins = () =>
  [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_FRONTEND_URL,
  ].filter(Boolean)

const getCloudinaryFolder = () => process.env.FOLDER_NAME || "civica"

module.exports = {
  validateEnv,
  getAllowedOrigins,
  getCloudinaryFolder,
  requiredEnv,
  optionalEnv,
}
