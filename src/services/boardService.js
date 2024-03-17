/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong database
    // ...

    // Làm thêm các xử lý logic khác với các Collection khác tùy thuộc vào đặc thù dự án...vv
    // Gửi Email, notification về cho Admin khi có board mới được tạo...vv

    // Trả kết quả về (TRONG SERVICE LUÔN PHẢI CÓ RETURN)
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
