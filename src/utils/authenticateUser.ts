import createHttpError from 'http-errors'
import { Request, Response, NextFunction } from 'express'

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user._id === req.pastry!.createdBy) {
      next()
    } else {
      next(createHttpError(403))
    }
  } catch (error) {
    console.log('Error in authUser: ', error)
    next(createHttpError(500))
  }
}
