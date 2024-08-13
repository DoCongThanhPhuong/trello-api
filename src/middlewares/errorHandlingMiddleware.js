/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { discordLogger } from '~/loggers/discordLogger'

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  discordLogger.sendFormatCode({
    title: `Method: ${req.method}`,
    code: req.method === 'GET' ? req.query : req.body,
    message: `${req.get('host')}${req.originalUrl}`,
    error: `${err.statusCode} - ${err.message}`
  })

  res.status(responseError.statusCode).json(responseError)
}
