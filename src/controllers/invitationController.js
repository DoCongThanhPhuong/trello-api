import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const result = await invitationService.createNewBoardInvitation(
      req.body,
      inviterId
    )
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const listUserInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const results = await invitationService.listUserInvitations(userId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    const results = await invitationService.updateBoardInvitation(
      userId,
      invitationId,
      status
    )
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  createNewBoardInvitation,
  listUserInvitations,
  updateBoardInvitation
}
