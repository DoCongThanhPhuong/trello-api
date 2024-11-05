import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'
import { MailProvider } from '~/providers/MailProvider'
import ApiError from '~/utils/ApiError'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { omitUser } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const foundUser = await userModel.findOneByEmail(email)
    if (foundUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists')
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

    return omitUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const { email, token } = reqBody
    const foundUser = await userModel.findOneByEmail(email)
    if (!foundUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found')
    }
    const { _id, isActive, verifyToken } = foundUser
    if (isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already verified')
    }
    if (token !== verifyToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Token is invalid')
    }
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(_id, updateData)
    return omitUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const foundUser = await userModel.findOneByEmail(email)
    if (!foundUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found')
    }
    if (!foundUser.isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not verified')
    }
    const isPasswordValid = bcryptjs.compareSync(password, foundUser.password)
    if (!isPasswordValid) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your email or password is incorrect'
      )
    }
    const userInfo = {
      _id: foundUser._id,
      email: foundUser.email
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )
    return {
      ...omitUser(foundUser),
      accessToken,
      refreshToken
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'AUTH::INVALID_REFRESH_TOKEN')
    }
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )
    const { _id, email } = refreshTokenDecoded
    const userInfo = { _id, email }
    const foundUser = await userModel.findOneByEmail(email)
    if (!foundUser) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'AUTH::USER_NOT_FOUND')
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Please sign in!')
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}
