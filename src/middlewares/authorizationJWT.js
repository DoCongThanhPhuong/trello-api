import '~/config/firebase'
import { getAuth } from 'firebase-admin/auth'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

export const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1]

    try {
      const decodedToken = await getAuth().verifyIdToken(accessToken)
      res.locals.uid = decodedToken.uid
      next()
    } catch (err) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Forbidden', error: err.message })
    }
  } else if (env.BUILD_MODE === 'dev') {
    next()
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }
}
