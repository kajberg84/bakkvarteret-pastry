/**
 * Webhook controller.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import { Request, Response, NextFunction } from 'express'
import PastryhookModel from '../models/hook-model'
import createError from 'http-errors'
import { registeredHooks } from '../utils/registeredHooks'

/**
 *
 */
export class WebhookController {
  /**
   * Recieves a webook and saves it to DB.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { callbackUrl, event, secret } = req.body
      const userId = req.user._id

      //itterate trough registeredHooks and check if event is in it
      for (const hook in registeredHooks) {
        if (event !== hook) {
          next(createError(409, 'No hook registered for this event'))
        }
      }

      const newHook = new PastryhookModel({
        event: event,
        userId: userId,
        callbackUrl: callbackUrl,
        secret: secret
      })
      const response = await newHook.save()
      res.status(201).json(response)
    } catch (error) {
      console.log('Error in creating hook: ', error)
      next(createError(400, 'Conflict when creating hook'))
    }
  }
}
