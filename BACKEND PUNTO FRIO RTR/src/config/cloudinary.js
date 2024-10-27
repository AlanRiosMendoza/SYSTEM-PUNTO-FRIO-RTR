export const subirImagen = async (imagenPath, carpeta) => {
  const subirResultado = await cloudinary.uploader.upload(imagenPath, {
    folder: carpeta,
  })
  return subirResultado
}
