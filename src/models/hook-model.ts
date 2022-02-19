import mongoose, { Schema } from 'mongoose'

export interface IPastryHook {
  event: string
  userId: string
  callbackUrl: string
  secret: string
}

const hookSchema = new Schema<IPastryHook>(
  {
    event: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    callbackUrl: { type: String, required: true, trim: true },
    secret: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Secret to short'],
      maxlength: [1000, 'Secret to long']
    }
  },
  { timestamps: true }
)

const PastryhookModel = mongoose.model('PastryhookModel', hookSchema)

export default PastryhookModel
