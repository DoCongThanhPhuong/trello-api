import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.cardId

    if (req.body.comment) {
      const { uid, email, picture, name } = res.locals
      Object.assign(req.body.comment, {
        userId: uid,
        userEmail: email,
        userAvatar: picture,
        userDisplayName: name
      })
    }

    const updatedCard = await cardService.update(cardId, req.body)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  update
}
