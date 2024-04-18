import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getListByBoardId = async (req, res, next) => {
  try {
    const boardId = req.params.boardId
    const usersList = await userService.getListByBoardId(boardId)
    res.status(StatusCodes.OK).json(usersList)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getListByBoardId
}
