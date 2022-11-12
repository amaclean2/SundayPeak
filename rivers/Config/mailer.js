const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andrew@sundaypeak.com',
    pass: 'vtmrorarxqkhfcjc'
  }
})

module.exports = {
  transporter
}
