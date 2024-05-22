import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { checkBoardType } from '~/middlewares/checkBoardType'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(checkBoardType, boardController.getDetails)
  .put(checkBoardAccess, boardValidation.update, boardController.update)

// API hỗ trợ việc di chuyển Card giữa các Columns khác nhau trong một Board
Router.route('/supports/moving_card').put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

Router.route('/user/list_boards').get(boardController.getListByUserId)

export const boardRoute = Router
