const dotenv = require("dotenv")

dotenv.config()

const app = require("./app")
const database = require("./config/database")
const { cloudinaryConnect } = require("./config/cloudinary")
const { validateEnv } = require("./config/env")

const PORT = process.env.PORT || 4000

const startServer = async () => {
  try {
    validateEnv()

    await database.connect()

    cloudinaryConnect()

    app.listen(PORT, () => {
      console.log(`App is listening at ${PORT}`)
    })
  } catch (error) {
    console.error("Startup failed:", error.message)
    process.exit(1)
  }
}

startServer()
