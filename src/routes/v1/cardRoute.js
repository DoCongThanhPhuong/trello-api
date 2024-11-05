import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/').post(cardValidation.createNew, cardController.createNew)

Router.route('/:cardId').patch(cardValidation.update, cardController.update)

export const cardRoute = Router
