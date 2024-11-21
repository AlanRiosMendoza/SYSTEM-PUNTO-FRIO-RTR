import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async () => {
  try {
    // Determinar la URL de conexión según el entorno
    const dbUrl =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URL_TEST
        : process.env.NODE_ENV === 'production'
          ? process.env.MONGODB_URL_PRODUCTION
          : process.env.MONGODB_URL_DEVELOPMENT

    if (!dbUrl) {
      throw new Error(
        'No se encontró la URL de conexión para la base de datos.',
      )
    }

    const { connection } = await mongoose.connect(dbUrl, {})

    console.log(
      `Database connected: ${connection.host} on port ${connection.port} (ENV: ${process.env.NODE_ENV})`,
    )
  } catch (error) {
    console.error(`Error al conectar a la base de datos: ${error.message}`)
    process.exit(1)
  }
}

export default connection
