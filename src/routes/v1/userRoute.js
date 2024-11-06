import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  userController.createNew
)

Router.route('/verify').patch(
  userValidation.verifyAccount,
  userController.verifyAccount
)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/refresh_token').get(userController.refreshToken)

Router.route('/logout').delete(userController.logout)

Router.use(authMiddleware.isAuthorized)

Router.route('/update').patch(
  multerUploadMiddleware.upload.single('avatar'),
  userValidation.update,
  userController.update
)

export const userRoute = Router
