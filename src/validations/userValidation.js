import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    uid: Joi.string().required(),
    email: Joi.string().required().email(),
    avatar: Joi.string().required().uri(),
    displayName: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const userValidation = {
  login
}
