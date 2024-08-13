import express from 'express'
import { boardController } from '~/controllers/boardController'
import { authorizationJWT } from '~/middlewares/authorizationJWT'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { checkBoardType } from '~/middlewares/checkBoardType'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.use(authorizationJWT)

Router.route('/')
  .get(boardController.getListByUserId)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(checkBoardType, boardController.getDetails)
  .put(checkBoardAccess, boardValidation.update, boardController.update)

Router.route('/supports/moving_card').put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

export const boardRoute = Router
