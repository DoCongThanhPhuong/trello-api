import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { omitUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const { inviteeEmail, boardId } = reqBody
    const inviter = await userModel.findOneById(inviterId)
    const invitee = await userModel.findOneByEmail(inviteeEmail)
    if (!invitee) throw new ApiError(StatusCodes, 'Invitee not found')
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'INVITATION::BOARD_NOT_FOUND')
    }
    if (
      !board.ownerIds
        .map((id) => id.toString())
        .includes(inviter._id.toString()) &&
      !board.memberIds
        .map((id) => id.toString())
        .includes(inviter._id.toString())
    ) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'INVITATION::NOT_BOARD_MEMBER')
    }
    if (
      board.ownerIds
        .map((id) => id.toString())
        .includes(invitee._id.toString()) ||
      board.memberIds
        .map((id) => id.toString())
        .includes(invitee._id.toString())
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invitee is a board member')
    }

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: boardId,
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNew(newInvitationData)
    const getNewInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId
    )

    return {
      ...getNewInvitation,
      board,
      inviter: omitUser(inviter),
      invitee: omitUser(invitee)
    }
  } catch (error) {
    throw error
  }
}

const listUserInvitations = async (userId) => {
  try {
    const invitations = await invitationModel.listUserInvitations(userId)
    const response = invitations.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || 0
    }))
    return response
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const invitation = await invitationModel.findOneById(invitationId)
    if (!invitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }
    if (invitation.boardInvitation.status !== BOARD_INVITATION_STATUS.PENDING) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'INVITATION::ALREADY_ACCEPTED_OR_REJECTED'
      )
    }
    if (invitation.inviteeId.toString() !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'INVITATION::NOT_INVITED_BY_USER'
      )
    }
    const board = await boardModel.findOneById(
      invitation.boardInvitation.boardId
    )
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'INVITATION::BOARD_NOT_FOUND')
    }
    if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
      if (
        board.ownerIds.map((id) => id.toString()).includes(userId) ||
        board.memberIds.map((id) => id.toString()).includes(userId)
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'You are already a member of this board'
        )
      }
      await boardModel.pushMemberIds(board._id, userId)
    }

    const updatedInvitation = await invitationModel.update(invitationId, {
      boardInvitation: { ...invitation.boardInvitation, status }
    })

    return updatedInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation,
  listUserInvitations,
  updateBoardInvitation
}
