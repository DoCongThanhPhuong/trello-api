import '~/config/firebase'
import { getAuth } from 'firebase-admin/auth'
import { StatusCodes } from 'http-status-codes'

export const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1]

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        res.locals.uid = decodedToken.uid
        next()
      })
      .catch((err) => {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Forbidden', error: err })
      })
  } else {
    // next()
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }
}
