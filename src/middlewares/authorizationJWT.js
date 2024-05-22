import { getAuth } from 'firebase-admin/auth'
import { StatusCodes } from 'http-status-codes'
import '~/config/firebase'

export const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }

  const accessToken = authorizationHeader.split(' ')[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(accessToken)
    const { uid, email, picture, name } = decodedToken
    Object.assign(res.locals, { uid, email, picture, name })
    next()
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Token expired' })
    }
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: 'Forbidden', error: err.message })
  }
}
