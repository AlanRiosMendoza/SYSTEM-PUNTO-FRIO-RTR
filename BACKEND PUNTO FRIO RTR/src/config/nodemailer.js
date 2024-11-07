import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  },
})

const sendMailToUser = (userMail, resetCode) => {
  let mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: 'Restablecimiento de contraseña',
    html: ` <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
            <h2 style="color: #0056b3; font-size: 24px; margin: 0;">Restablece tu contraseña</h2>
        </header>
        
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Hola, hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste este cambio, puedes ignorar este mensaje.
        </p>

        <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Utiliza el siguiente código para continuar o haz clic en el botón a continuación para restablecer tu contraseña:
        </p>

        <div style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #0056b3;">
        ${resetCode}
    </div>

        <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.URL_LOCAL}/api/v1/recuperar-password/${resetCode}" style="text-decoration: none; background-color: #0056b3; color: #fff; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Restablecer Contraseña</a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
            Este enlace expirará en 30 minutos.
        </p>

        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Punto Frío R.T.T. Todos los derechos reservados.</p>
        </footer>
    </div>
`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo enviado: ' + info.response)
    }
  })
}

export default sendMailToUser
