import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { slugify } from '~/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    const resBoard = cloneDeep(board)

    // Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // ObjectId trong MongoDB có support method .equals (method của MongoDB)
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
    })

    // Xóa mảng cards (cùng cấp với mảng columns) ban đầu khỏi resBoard
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cập nhật mảng cardOrderIds của Column cũ (Xóa _id của Card trong mảng cardOrderIds cũ)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // B2: Cập nhật mảng cardOrderIds của Column mới (Thêm _id của Card vào mảng cardOrderIds mới)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // B3: Cập nhật lại trường columnId của Card di chuyển
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updatedResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const getListByUserId = async (userId) => {
  try {
    const boardsList = await boardModel.getListByUserId(userId)

    return boardsList
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getListByUserId
}
