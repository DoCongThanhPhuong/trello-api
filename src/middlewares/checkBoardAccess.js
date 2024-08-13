import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

export const checkBoardAccess = async (req, res, next) => {
  try {
    const uid = res.locals.uid
    const { boardId, columnId, cardId } = req.params

    let board
    if (boardId) {
      board = await boardModel.findOneById(boardId)
      if (!board) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Board not found' })
      }

      if (!board.memberIds.includes(uid)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'You are not a member of this board'
        })
      }
    } else if (columnId) {
      const column = await columnModel.findOneById(columnId)
      if (!column) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Column not found' })
      }

      board = await boardModel.findOneById(column.boardId)
      if (!board) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Board not found' })
      }

      if (!board.memberIds.includes(uid)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'You are not a member of the board'
        })
      }
    } else if (cardId) {
      const card = await cardModel.findOneById(cardId)
      if (!card) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Card not found' })
      }

      const column = await columnModel.findOneById(card.columnId)
      if (!column) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Column not found' })
      }

      board = await boardModel.findOneById(column.boardId)
      if (!board) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Board not found' })
      }

      if (!board.memberIds.includes(uid)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'You are not a member of the board'
        })
      }
    }

    next()
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error: err.message })
  }
}
