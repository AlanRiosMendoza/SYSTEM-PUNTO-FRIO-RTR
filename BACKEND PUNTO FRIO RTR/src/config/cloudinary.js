import { v2 as cloudinary } from 'cloudinary'




export const subirImagen = async (imagenPath, carpeta) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  return await cloudinary.uploader.upload(imagenPath, {
    folder: carpeta
  })
}
