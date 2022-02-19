import mongoose, { Schema, Document } from 'mongoose'

export interface IStore extends Document {
  name: string
  latitude: string
  longitude: string
}

// Schema
const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, maxlength: [100, 'Name to long'], trim: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  },
  { timestamps: true }
)

const IstoreModel = mongoose.model('IstoreModel', storeSchema)

export default IstoreModel
