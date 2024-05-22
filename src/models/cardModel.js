import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(1).max(50).trim().strict(),
  description: Joi.string().optional().min(3).max(255).trim().strict(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  cover: Joi.string().uri().default(null),
  memberIds: Joi.array().items(Joi.string()).default([]),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        userEmail: Joi.string().required().email(),
        userAvatar: Joi.string().required().uri(),
        userDisplayName: Joi.string().required(),
        content: Joi.string().required().min(1).max(500).trim().strict(),
        createdAt: Joi.date().timestamp('javascript').default(Date.now())
      })
    )
    .default([]),
  attachments: Joi.array()
    .items(
      Joi.object({
        fileName: Joi.string(),
        fileType: Joi.string(),
        fileURL: Joi.string().uri(),
        createdAt: Joi.date().timestamp('javascript').default(Date.now())
      })
    )
    .default([]),
  _destroy: Joi.boolean().default(false)
})

// Chỉ định các fields không được phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreating = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreating(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }

    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(cardId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Lọc các fields không được cho phép cập nhật
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId)

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(cardId)
        },
        {
          $set: updateData
        },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({
        columnId: new ObjectId(columnId)
      })

    // console.log('🚀 ~ deleteManyByColumnId ~ result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const destroyManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateMany(
        { columnId: new ObjectId(columnId) },
        {
          $set: {
            _destroy: true,
            updatedAt: Date.now()
          }
        }
      )

    // console.log('🚀 ~ deleteManyByColumnId ~ result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  destroyManyByColumnId
}
