import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/').post(userValidation.createNew, userController.createNew)

Router.route('/:boardId').get(userController.getListByBoardId)

export const userRoute = Router
