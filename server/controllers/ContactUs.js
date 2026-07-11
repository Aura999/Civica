const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  try {
    //confirmation mail to the sender
    await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Contact confirmation email sent")

    // 📨 2. Send notification email to support
    await mailSender(
      "civicasatyam@gmail.com",
      "New Contact Form Submission",
      `
  You received a new message from the website:

    Name: ${firstname} ${lastname}
   Email: ${email}
   Phone: ${countrycode} ${phoneNo}

📝 Message:
${message}

🕒 Submitted At: ${new Date().toLocaleString()}
      `
    )

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.error("Contact email failed:", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
