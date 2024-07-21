import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const login = async (req, res, next) => {
  try {
    const createdUser = await userService.login(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getBoardMembers = async (req, res, next) => {
  try {
    const boardId = req.params.boardId
    const boardMembers = await userService.getBoardMembers(boardId)
    res.status(StatusCodes.OK).json(boardMembers)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  login,
  getBoardMembers
}
