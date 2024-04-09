import '~/config/firebase'
import { getAuth } from 'firebase-admin/auth'

export const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1]

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        // res.locals.uid = decodedToken.uid
        next()
      })
      .catch((err) => {
        return res.status(403).json({ message: 'Forbidden', error: err })
      })
  } else {
    // next()
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
