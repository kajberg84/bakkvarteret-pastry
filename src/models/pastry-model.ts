// pastry-model.ts

import mongoose, { Schema } from 'mongoose'

interface IPastry {
  createdBy: string
  asset_id: string
  public_id: string
  cloud_url: string
  category: string
  name: string
  description?: string
  rating: number
  store: string
}

// Schema
const pastrySchema = new Schema<IPastry>(
  {
    createdBy: { type: String, required: true },
    asset_id: { type: String, required: true },
    public_id: { type: String, required: true },
    cloud_url: { type: String, required: true },
    category: { type: String, required: true, maxlength: [100, 'Name to long'], trim: true },
    name: { type: String, required: true, maxlength: [100, 'Name to long'], trim: true },
    description: { type: String, required: false, maxlength: [1000, 'Description to long'], trim: true },
    rating: { type: Number, required: true, min: [1, 'Rating to low'], max: [5, 'Rating to high'] },
    store: { type: String, required: true }
  },
  { timestamps: true }
)

const PastryModel = mongoose.model('PastryModel', pastrySchema)

export default PastryModel
