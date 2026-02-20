const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const companyName = process.env.COMPANY_NAME;
  const supportEmail = process.env.COMPANY_SUPPORT_EMAIL;
  const logoUrl = process.env.COMPANY_LOGO_URL;

  await resend.emails.send({
    from: `${process.env.EMAIL_FROM_NAME} <onboarding@resend.dev>`,
    to: email,
    subject: `Recuperación de contraseña - ${companyName}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Recuperación de contraseña</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" 
              style="max-width:600px;background:#ffffff;border-radius:8px;padding:30px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
              
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" width="120"/>` : `<h2>${companyName}</h2>`}
                </td>
              </tr>

              <tr>
                <td>
                  <h2 style="color:#333;">Recuperación de contraseña</h2>
                  <p style="color:#555;line-height:1.6;">
                    Hemos recibido una solicitud para restablecer tu contraseña.
                  </p>
                  <p style="color:#555;line-height:1.6;">
                    Haz clic en el botón de abajo para continuar:
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:25px 0;">
                  <a href="${resetUrl}" 
                    style="background-color:#2563eb;color:#ffffff;text-decoration:none;
                    padding:12px 24px;border-radius:6px;display:inline-block;font-weight:bold;">
                    Restablecer contraseña
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  <p style="color:#777;font-size:14px;">
                    Este enlace expirará en 1 hora.
                  </p>
                  <p style="color:#777;font-size:14px;">
                    Si no solicitaste este cambio, puedes ignorar este correo.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="border-top:1px solid #eee;padding-top:20px;">
                  <p style="font-size:12px;color:#999;text-align:center;">
                    © ${new Date().getFullYear()} ${companyName}.  
                    Si necesitas ayuda contáctanos en 
                    <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">
                      ${supportEmail}
                    </a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  });
};

module.exports = { sendPasswordResetEmail };