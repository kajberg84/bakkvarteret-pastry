/**
 * Mongoose configuration.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.DB_CONNECTION!

interface MongooseOptions extends ConnectOptions {
  useNewUrlParser: boolean
  useUnifiedTopology: boolean
}

const options: MongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
export async function connectDB() {
  // Bind connection to events (to get notifications).
  mongoose.connection.on('connected', () => console.log('Connected to Mongo DB atlas'))

  mongoose.connection.on('error', (err) => console.error(`Mongoose connection error has occurred: ${err}`))

  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  // Connect to the server.
  return mongoose.connect(uri, options)
}
