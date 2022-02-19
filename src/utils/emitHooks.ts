import PastryhookModel from '../models/hook-model'
import { Response, NextFunction } from 'express'
import axios from 'axios'

export async function emitHooks(eventString: string, data: any, res: Response, next: NextFunction) {
  // Get all hooks
  try {
    const allHooks = await PastryhookModel.find({ event: eventString })
    if (!allHooks) {
      return
    }
    allHooks.forEach((hook: any) => {
      const { callbackUrl, secret } = hook
      const headers = {
        'Content-Type': 'application/json',
        'X-Hook-Secret': secret
      }
      const payload = {
        event: eventString,
        data: data
      }
      axios.post(callbackUrl, payload, { headers })
    })
  } catch (error) {
    console.log('error', error)
  }
}
