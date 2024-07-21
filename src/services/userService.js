import { userModel } from '~/models/userModel'

const login = async (reqBody) => {
  try {
    const foundUser = await userModel.findOneByUid(reqBody.uid)

    if (foundUser) {
      // Nếu uid đã tồn tại, trả về user đã tồn tại
      return foundUser
    } else {
      // Nếu uid chưa tồn tại, thêm mới user vào cơ sở dữ liệu và trả về user mới
      const createdUser = await userModel.createNew(reqBody)
      const getNewUser = await userModel.findOneById(createdUser.insertedId)

      return getNewUser
    }
  } catch (error) {
    throw error
  }
}

const getBoardMembers = async (boardId) => {
  try {
    const boardMembers = await userModel.getBoardMembers(boardId)

    return boardMembers
  } catch (error) {
    throw error
  }
}

export const userService = {
  login,
  getBoardMembers
}
