import express from 'express'
import { userController } from '~/controllers/userController'
import { authorizationJWT } from '~/middlewares/authorizationJWT'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.use(authorizationJWT)

Router.route('/login').post(userValidation.login, userController.login)
Router.route('/profile').get(userController.getProfile)
Router.route('/members/:boardId').get(userController.getBoardMembers)

export const userRoute = Router
