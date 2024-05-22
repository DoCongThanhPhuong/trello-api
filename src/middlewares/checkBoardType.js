import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'

export const checkBoardType = async (req, res, next) => {
  try {
    const uid = res.locals.uid
    const { boardId } = req.params

    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Board not found' })
    }

    if (board.type === 'private' && !board.memberIds.includes(uid)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Access forbidden: You are not a member of this private board'
      })
    }
    next()
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred', error: err.message })
  }
}
