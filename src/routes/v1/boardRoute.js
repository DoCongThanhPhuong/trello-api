import express from 'express'
import { boardController } from '~/controllers/boardController'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { checkBoardType } from '~/middlewares/checkBoardType'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get(boardController.getListByUserId)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(checkBoardType, boardController.getDetails)
  .put(checkBoardAccess, boardValidation.update, boardController.update)

// API hỗ trợ việc di chuyển Card giữa các Columns khác nhau trong một Board
Router.route('/supports/moving_card').put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

export const boardRoute = Router
