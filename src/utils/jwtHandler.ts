// @ts-nocheck

// jwtHandler.js

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { getKey } from './keyHandler'
dotenv.config()

/**
 * Authenticates requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.split(' ')
  if (authorization?.[0] !== 'Bearer') {
    next(createError(401))
    return
  }
  try {
    const publicKey = getKey('public-key.pem')
    const payload: any = jwt.verify(authorization[1], publicKey)
    req.user = {
      _id: payload._id,
      email: payload.email,
      permissionLevel: payload.permissionLevel
    }

    next()
  } catch (error) {
    console.log('ERROR i authJWT', error)
    next(createError(403))
  }
}

/**
 * Authorize requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {number} permissionLevel - ...
 */
export const hasPermission = (req: Request, res: Response, next: NextFunction, permissionLevel: number) => {
  req.user.permissionLevel >= permissionLevel ? next() : next(createError(403))
}
