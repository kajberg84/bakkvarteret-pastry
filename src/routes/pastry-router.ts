// @ts-nocheck

/**
 * User Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import { PastryController } from '../controllers/pastry-controller'
import { authenticateJWT, hasPermission } from '../utils/jwtHandler'
import { authenticateUser } from '../utils/authenticateUser'
import multer from 'multer'

export const pastryRouter: Router = express.Router()
const controller = new PastryController()

const PermissionLevels = Object.freeze({
  GUEST: 1,
  OWNER: 2,
  AUTH: 4,
  ADMIN: 8
})

// provide req.pastry to the route if :id is present in the route path
pastryRouter.param('id', (req, res, next, _id) => controller.loadPastry(req, res, next, _id))

const storage = multer.diskStorage({
  filename: function (req: Request, file: any, cb: any) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage })

// POST, create pastry
pastryRouter.post(
  '/pastry/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  upload.array('pictures', 1),
  (req, res, next) => controller.create(req, res, next)
)

// GET one pastry.
pastryRouter.get(
  '/pastry/:id',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.get(req, res, next)
)

// GET all pastries.
pastryRouter.get(
  '/pastries/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.getAll(req, res, next)
)

// PUT, Update pastry
pastryRouter.put(
  '/pastry/:id',
  authenticateJWT,
  authenticateUser,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.update(req, res, next)
)

// Patch, partially update pastry
pastryRouter.patch(
  '/pastry/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  upload.array('pictures', 1),
  (req, res, next) => controller.partiallyUpdate(req, res, next)
)

// DELETE, delete pastry.
pastryRouter.delete(
  '/pastry/:id',
  authenticateJWT,
  authenticateUser,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.delete(req, res, next)
)

