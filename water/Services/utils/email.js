const { transporter } = require('../../Config/mailer')
const logger = require('../../Config/logger')

const handleEmailReset = async ({ email, resetToken }) => {
  const info = await transporter.sendMail({
    from: '"Andrew" <andrew@sundaypeak.com>',
    to: email,
    subject: `Let's get you back in`,
    text: `Create a new password http://sundaypeak.com/discover?passwordReset=${resetToken}`,
    html: `<p>Whoops, looks like you forgot your password<br />Here's a link to reset it.</p><a href="http://sundaypeak.com/password?resetToken=${resetToken}">Create a new password</a>`
  })

  logger.info('message sent', info.messageId, email)
}

const handleEmailUserFollowed = async ({ email, followingUserName }) => {
  const info = await transporter.sendMail({
    from: '"Andrew" <andrew@sundaypeak.com>',
    to: email,
    subject: 'You made a new friend!',
    text: `User ${followingUserName} wants to go on an adventure. Log in to have a chat: http://sundaypeak.com/login`
  })

  logger.info('message sent', info.messageId, email)
}

module.exports = {
  handleEmailReset,
  handleEmailUserFollowed
}
