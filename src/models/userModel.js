import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  uid: Joi.string().required(),
  email: Joi.string().required().email(),
  avatar: Joi.string().required().uri(),
  displayName: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'uid', 'createdAt']

const validateBeforeCreating = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreating(data)

    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData)

    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(userId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUid = async ({ uid, select = [] }) => {
  try {
    const projection = select.reduce((acc, field) => {
      acc[field] = 0
      return acc
    }, {})

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ uid: uid }, { projection })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (uid, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          uid: uid
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

const getBoardMembers = async (boardId) => {
  try {
    const board = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) })

    if (!board || !Array.isArray(board.memberIds)) {
      return
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        uid: { $in: board.memberIds }
      })
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByUid,
  update,
  getBoardMembers
}
