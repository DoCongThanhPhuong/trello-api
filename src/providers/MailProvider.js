import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD
  }
})

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"No Reply" <noreply@trello.com>',
    to,
    subject,
    html
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    })
  })
}

export const MailProvider = {
  sendEmail
}
