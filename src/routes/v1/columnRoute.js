import express from 'express'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/').post(columnValidation.createNew, columnController.createNew)

Router.route('/:columnId')
  .patch(columnValidation.update, columnController.update)
  .delete(columnValidation.deleteItem, columnController.deleteItem)

export const columnRoute = Router
