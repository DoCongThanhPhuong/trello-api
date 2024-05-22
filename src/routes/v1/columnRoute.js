import express from 'express'
import { columnController } from '~/controllers/columnController'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(columnValidation.createNew, columnController.createNew)

Router.route('/:columnId')
  .put(checkBoardAccess, columnValidation.update, columnController.update)
  .delete(
    checkBoardAccess,
    columnValidation.deleteItem,
    columnController.deleteItem
  )

export const columnRoute = Router
