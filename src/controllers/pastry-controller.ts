//@ts-nocheck

/**
 * Module for the pastry Controller.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import createError from 'http-errors'
import PastryModel from '../models/pastry-model'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import { createSearchString } from '../utils/urlHandler'
import HateoasLinks from '../utils/hateoasLinks'
import { emitHooks } from '../utils/emitHooks'

const baseUrl = process.env.BASE_URL

/**
 * Encapsulates a controller.
 */
export class PastryController {
  /**
   * Get a pastry and save as req.pastry.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {number} _id - Id of pastry.
   */
  async loadPastry(req: Request, res: Response, next: NextFunction, _id: string) {
    const urlFields = req.query.fields || ''
    const searchFields = createSearchString(urlFields)
    try {
      const pastry = await PastryModel.findOne({ _id: _id }).select(searchFields)
      if (!pastry) {
        next(createError(404, 'Pastry with id not found'))
        return
      }

      req.pastry = pastry
      next()
    } catch (error) {
      console.log('Error in loading pastry: ', error)
      next(createError(409, 'Conflict when loading pastry'))
    }
  }

  /**
   * Create a new pastry.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const { category, name, description, rating, store } = req.body

    try {
      let pictureFiles = req.files
      if (!pictureFiles) return res.status(400).json({ message: 'No picture attached!' })

      //map through pastries and upload all images sent in the array.
      let multiplePicturePromise = pictureFiles.map((picture) => cloudinary.v2.uploader.upload(picture.path))
      let pastryResponses = await Promise.all(multiplePicturePromise)

      const userId = req.user._id

      const newPastry = new PastryModel({
        createdBy: userId,
        asset_id: pastryResponses[0].asset_id,
        public_id: pastryResponses[0].public_id,
        cloud_url: pastryResponses[0].secure_url,
        category: category,
        name: name,
        description: description,
        rating: rating,
        store: store
      })

      const createPastry = await newPastry.save()
      // Emit an event to all subscribers.
      await emitHooks('newPastry', createPastry)

      res.status(201).json('Save successful')
    } catch (error) {
      console.log('error: ', error)
      next(createError(409, 'Create pastry Error'))
    }
  }

  /**
   * Get pastry by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      if (!mongoose.isValidObjectId(req.pastry._id)) {
        throw createError(404, 'Pastry with id not found')
      }
      const hateoas = new HateoasLinks(baseUrl)
      const response = await hateoas.createLink(req.pastry, 'api/pastry')

      res.status(200).json(response)
    } catch (error) {
      console.log('Error in get pastry by id')
      next(createError(409, 'Pastry with id not found'))
    }
  }

  /**
   * Get all pastries.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query
    const skip = req.query.skip || 0
    const limit = req.query.limit || 0
    const urlFields = req.query.fields || ''
    const searchFields = createSearchString(urlFields)

    try {
      const result = await PastryModel.find(query).skip(skip).limit(limit).select(searchFields)

      const hateoas = new HateoasLinks(baseUrl)
      const response = hateoas.createCollectionResponse(result, 'api/pastry')

      res.status(200).json(response)
    } catch (error) {
      console.log('ERROR i get all')
      next(createError(409, 'Error in finding all pastries'))
    }
  }

  /**
   * Update pastry.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    const filter = { _id: req.pastry._id }
    const update = req.query
    const options = { new: true }
    console.log('inne i update')
    try {
      await PastryModel.findByIdAndUpdate(filter, update, options)
      res.status(204).json('Pastry updated')
    } catch (error) {
      console.log('ERROR in update pastry')
      next(createError(404, 'Can not update pastry'))
    }
  }

  /**
   * Patch pastry.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate(req: Request, res: Response, next: NextFunction) {
    const filter = { _id: req.pastry._id }
    const update = req.query
    const options = { new: true }

    try {
      await PastryModel.findByIdAndUpdate(filter, update, options)
      res.status(204).json('Pastry updated')
    } catch (error) {
      console.log('ERROR in update pastry')
      next(createError(404, 'Can not update pastry'))
    }
  }

  /**
   * Delete pastry.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PastryModel.findByIdAndDelete({ _id: req.pastry._id })
      console.log('deleted', response)
      // Remove the file from cloudinary
      cloudinary.v2.uploader.destroy(response.public_id)
      res.status(204).json('Pastry deleted')
    } catch (error) {
      console.log('ERROR i update pastry')
      next(createError(409, 'Can not delete pastry'))
    }
  }
}
