const request = require("supertest")
const app = require("../app")

describe("Phase 3 backend security foundations", () => {
  it("returns health status without authentication", async () => {
    const response = await request(app).get("/api/health")

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.status).toBe("ok")
  })

  it("returns a standardized 404 for unknown API routes", async () => {
    const response = await request(app).get("/api/does-not-exist")

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.errors).toEqual([])
  })

  it("rejects malformed login requests during validation", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email" })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Validation failed")
  })

  it("rejects authenticated routes when the token is missing", async () => {
    const response = await request(app).get("/api/v1/profile/getUserDetails")

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })

  it("rejects unauthenticated course deletion", async () => {
    const response = await request(app)
      .delete("/api/v1/course/deleteCourse")
      .send({ courseId: "64f000000000000000000000" })

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })

  it("does not expose stack traces in safe error responses", async () => {
    const response = await request(app).get("/api/does-not-exist")

    expect(response.body.stack).toBeUndefined()
    expect(JSON.stringify(response.body)).not.toContain("Error:")
  })
})
