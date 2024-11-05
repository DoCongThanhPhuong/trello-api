import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'AUTH::ACCESS_TOKEN_NOT_FOUND'))
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    const foundUser = await userModel.findOneByEmail(accessTokenDecoded.email)
    if (!foundUser) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'AUTH::USER_NOT_FOUND'))
      return
    }
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'AUTH::NEED_TO_REFRESH_TOKEN'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'AUTH::INVALID_TOKEN'))
  }
}

export const authMiddleware = {
  isAuthorized
}
