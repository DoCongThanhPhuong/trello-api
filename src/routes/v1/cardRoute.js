import express from 'express'
import { cardController } from '~/controllers/cardController'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(
  checkBoardAccess,
  cardValidation.createNew,
  cardController.createNew
)

Router.route('/:cardId').put(
  checkBoardAccess,
  cardValidation.update,
  cardController.update
)

export const cardRoute = Router
