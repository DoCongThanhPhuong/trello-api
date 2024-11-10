import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/').get(invitationController.listUserInvitations)

Router.route('/board').post(
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
)

Router.route('/board/:invitationId').patch(
  invitationValidation.updateBoardInvitation,
  invitationController.updateBoardInvitation
)

export const invitationRoute = Router
