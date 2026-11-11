const { transporter } = require('../../../Config/mailer')
const logger = require('../../../Config/logger')
const fs = require('fs')
const { promisify } = require('util')
const handlebars = require('handlebars')

const readFilePromise = promisify(fs.readFile)

const handleEmailReset = async ({ email, resetToken }) => {
  const info = await transporter.sendMail({
    from: '"Andrew" <andrew@sundaypeak.com>',
    to: email,
    subject: `Let's get you back in`,
    text: `Create a new password https://sundaypeak.com/discover?passwordReset=${resetToken}`,
    html: `<p>Whoops, looks like you forgot your password<br />Here's a link to reset it.</p><a href="https://sundaypeak.com/password?resetToken=${resetToken}">Create a new password</a>`
  })

  logger.info('reset email message sent', info.messageId, email)
}

const handleEmailUserFollowed = async ({
  email,
  displayName,
  followerDisplayName
}) => {
  const html = await readFilePromise(
    './templates/newFriendTemplate.html',
    'utf-8'
  )
  const template = handlebars.compile(html)
  const data = {
    displayName,
    followerDisplayName
  }
  const htmlToSend = template(data)

  const info = await transporter.sendMail({
    from: '"Sunday Peak" <andrew@sundaypeak.com>',
    to: email,
    subject: 'You made a new friend!',
    text: `User ${followerDisplayName} wants to go on an adventure. Log in to have a chat: https://sundaypeak.com/login`,
    html: htmlToSend
  })

  logger.info('new friend message sent', info.messageId, email)
}

const handleNewUserEmail = async ({ email, displayName }) => {
  const html = await readFilePromise(
    './templates/newUserTemplate.html',
    'utf-8'
  )
  const template = handlebars.compile(html)
  const data = {
    displayName
  }
  const htmlToSend = template(data)

  const info = await transporter.sendMail({
    from: '"Andrew" <andrew@sundaypeak.com>',
    to: email,
    subject: 'You made a new friend!',
    text: `User ${followerDisplayName} wants to go on an adventure. Log in to have a chat: https://sundaypeak.com/login`,
    html: htmlToSend
  })

  logger.info('new friend message sent', info.messageId, email)
}

module.exports = {
  handleEmailReset,
  handleEmailUserFollowed,
  handleNewUserEmail
}
