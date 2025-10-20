// const nodemailer = require("nodemailer")

// const mailSender = async (email, title, body) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       secure: false,
//     })

//     let info = await transporter.sendMail({
//       from: `"Civica" <${process.env.MAIL_USER}>`, // sender address
//       to: `${email}`, // list of receivers
//       subject: `${title}`, // Subject line
//       html: `${body}`, // html body
//     })
//     console.log(info.response)
//     return info
//   } catch (error) {
//     console.log(error.message)
//     return error.message
//   }
// }

// module.exports = mailSender


const axios = require("axios");

const mailSender = async (email, title, body) => {
  try {
    const res = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Civica <satyam2003maanu@gmail.com>",
        to: `${email}`, // list of receivers
        subject: `${title}`, // Subject line
        html: `${body}`, // html body
      },
      {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      }
    );
    console.log("Email API status:", res.status);
    return res.data;
  } catch (err) {
    console.error("Mail API error:", err.message);
    return null;
  }
};

module.exports = mailSender;