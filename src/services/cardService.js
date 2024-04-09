import { v2 as cloudinary } from 'cloudinary'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) await columnModel.pushCardOrderIds(getNewCard)

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  try {
    const card = await cardModel.findOneById(cardId)
    const updateData = { ...reqBody }

    if (reqBody.comment) {
      reqBody.comment.updatedAt = Date.now()
      updateData.comments = [...card.comments, reqBody.comment]
      delete updateData.comment
    }

    if (reqBody.cover) {
      if (card.cover) {
        const imgId = card.cover.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(imgId)
      }
      const uploadedResponse = await cloudinary.uploader.upload(reqBody.cover)
      updateData.cover = uploadedResponse.secure_url
    }

    updateData.updatedAt = Date.now()

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
