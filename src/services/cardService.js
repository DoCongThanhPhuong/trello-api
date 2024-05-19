import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { v2 as cloudinary } from 'cloudinary'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      // Cập nhật mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  try {
    if (reqBody.cover) {
      const card = await cardModel.findOneById(cardId)
      if (card.cover) {
        const imgId = card.cover.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(imgId)
      }
      const uploadedResponse = await cloudinary.uploader.upload(reqBody.cover)
      reqBody.cover = uploadedResponse.secure_url
    }
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedCard = await cardModel.update(cardId, updateData)

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
