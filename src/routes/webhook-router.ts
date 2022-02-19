/**
 * Webhook Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import { authenticateJWT, hasPermission } from '../utils/jwtHandler'
import { WebhookController } from '../controllers/webhook-controller'

export const webhookRouter: Router = express.Router()
const webhookController = new WebhookController()

const PermissionLevels = Object.freeze({
  GUEST: 1,
  OWNER: 2,
  AUTH: 4,
  ADMIN: 8
})

webhookRouter.post(
  '/create',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => webhookController.create(req, res, next)
)
