import express from 'express'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get(boardController.getListByUserId)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(boardController.getDetails)
  .patch(boardValidation.update, boardController.update)

Router.route('/supports/moving_card').patch(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

export const boardRoute = Router
