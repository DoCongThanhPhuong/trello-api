import { userModel } from '~/models/userModel'

const login = async (reqBody) => {
  try {
    const foundUser = await userModel.findOneByUid({ uid: reqBody.uid })
    if (foundUser) {
      return foundUser
    } else {
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

const getProfile = async (uid) => {
  try {
    const user = await userModel.findOneByUid({ uid })
    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  login,
  getBoardMembers,
  getProfile
}
