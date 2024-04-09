import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { omit } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import { MailProvider } from '~/providers/MailProvider'
import ApiError from '~/utils/ApiError'
import { WEBSITE_DOMAIN } from '~/utils/constants'

const createNew = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const foundUser = await userModel.findOneByEmail(email)
    if (foundUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    const nameFromEmail = email.split('@')[0]
    const newUser = {
      email,
      password: bcryptjs.hashSync(password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'TRELLO: Please verify your email before using our service!'
    const html = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/>Tucker Do</h3>
    `
    await MailProvider.sendEmail(email, customSubject, html)

    return omit(getNewUser, ['password', 'verifyToken', '_destroy'])
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
