const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andrew@sundaypeak.com',
    pass: process.env.NODEMAILER_APP_PASSWORD
  }
})

module.exports = {
  transporter
}
