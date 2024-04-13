import { userModel } from '~/models/userModel'

const createNew = async (reqBody) => {
  try {
    const newUser = {
      ...reqBody
    }
    // Kiểm tra xem uid đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await userModel.findOneByUid(newUser.uid)

    if (existingUser) {
      // Nếu uid đã tồn tại, trả về user đã tồn tại
      return existingUser
    } else {
      // Nếu uid chưa tồn tại, thêm mới user vào cơ sở dữ liệu và trả về user mới
      const createdUser = await userModel.createNew(newUser)
      const getNewUser = await userModel.findOneById(createdUser.insertedId)

      return getNewUser
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
