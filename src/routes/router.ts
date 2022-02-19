/**
 * Main Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import createError from 'http-errors'
import { pastryRouter } from './pastry-router'
import { webhookRouter } from './webhook-router'
const router: Router = express.Router()

router.use('/api/', pastryRouter)
router.use('/api/webhook', webhookRouter)


// Catch 500 as last route
router.use('*', (req, res, next) => next(createError(500)))

export default router
