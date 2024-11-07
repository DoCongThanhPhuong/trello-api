import express from 'express'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/')
  .get(boardController.listUserBoards)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(boardController.getDetails)
  .patch(boardValidation.update, boardController.update)

Router.route('/supports/moving_card').patch(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

export const boardRoute = Router
