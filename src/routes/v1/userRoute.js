import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  userController.createNew
)

export const userRoute = Router
