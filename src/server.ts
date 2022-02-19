// Server.js

import express from 'express'
import router from './routes/router'
import dotenv from 'dotenv'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { Request, Response, NextFunction } from 'express'
import { connectDB } from './mongoose/mongoose'
import { setupCloudinary } from './utils/cloudinaryConfig'
dotenv.config()

interface Error {
  status?: number
  message?: string
}

try {
  setupCloudinary()
  /**
   * The main function of the server.
   */
  const main = async () => {
    // Connect to DB
    await connectDB()

    const app = express()
    const PORT = process.env.PORT || 5000

    app.use(helmet())

    // Set various HTTP headers

    app.use(helmet.noSniff())
    app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }))
    app.use(helmet.hidePoweredBy())
    app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }))
    app.use(
      helmet.dnsPrefetchControl({
        allow: true
      })
    )
    app.use(
      helmet.frameguard({
        action: 'deny'
      })
    )
    app.use(helmet.xssFilter())
    app.use(helmet.ieNoOpen())

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'"],
          'img-src': ["'self'"],
          'font-src': ["'self'"],
          'prefetch-src': ["'self'"],
          'object-src': ["'none'"],
          'media-src': ["'self'"],
          'frame-src': ["'self'"],
          'child-src': ["'self'"],
          'connect-src': ["'self'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
          'frame-ancestors': ["'self'"],
          'upgrade-insecure-requests': [],
          'manifest-src': ["'self'"],
          'worker-src': ["'self'"]
        }
      })
    )

    app.use(logger('dev'))

    // Parse requests of the content type application/x-www-form-urlencoded.
    // Populates the request object with a body object (req.body).
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(express.json({ limit: '500kb' }))

    // Executes middleware before the routes.
    app.use((req, res, next) => {
      next()
    })

    app.use('/', router)

    // Error handler.
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      err.status = err.status || 500

      res.status(err.status).json({
        status: err.status,
        message: err.message
      })
      console.log('Server', err.message)
    })

    app.listen(PORT, () => {
      console.log(`Auth Service running at http://localhost:${PORT}`)
      console.log('Ctrl-c to close server')
    })
  }

  main()
} catch (err: any) {
  console.log('Server setup:', err.message)
}
