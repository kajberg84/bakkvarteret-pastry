import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

export const setupCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
  })
}

// cloudinary.v2.config({
//   cloud_name: 'kaj-cloud',
//   api_key: '429552566693612',
//   api_secret: '0PishDUcNKoKyLcGTuSWAPotAqo'
// })
