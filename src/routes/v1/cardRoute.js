import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authorizationJWT } from '~/middlewares/authorizationJWT'
import { checkBoardAccess } from '~/middlewares/checkBoardAccess'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.use(authorizationJWT)

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
