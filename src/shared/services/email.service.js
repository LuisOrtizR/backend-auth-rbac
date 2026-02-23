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
                  <p style="color:#555;line-height:1.6;">Hemos recibido una solicitud para restablecer tu contraseña.</p>
                  <p style="color:#555;line-height:1.6;">Haz clic en el botón de abajo para continuar:</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:25px 0;">
                  <a href="${resetUrl}"
                    style="background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:bold;">
                    Restablecer contraseña
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color:#777;font-size:14px;">Este enlace expirará en 1 hora.</p>
                  <p style="color:#777;font-size:14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </td>
              </tr>
              <tr>
                <td style="border-top:1px solid #eee;padding-top:20px;">
                  <p style="font-size:12px;color:#999;text-align:center;">
                    © ${new Date().getFullYear()} ${companyName}.
                    Si necesitas ayuda contáctanos en
                    <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">${supportEmail}</a>
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

const sendPurgeNotificationEmail = async (email, requestTitle, deletedReason) => {
  const newRequestUrl = `${process.env.FRONTEND_URL}/dashboard/requests`;
  const companyName = process.env.COMPANY_NAME;
  const supportEmail = process.env.COMPANY_SUPPORT_EMAIL;
  const logoUrl = process.env.COMPANY_LOGO_URL;

  await resend.emails.send({
    from: `${process.env.EMAIL_FROM_NAME} <onboarding@resend.dev>`,
    to: email,
    subject: `Tu solicitud ha sido eliminada permanentemente - ${companyName}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Solicitud eliminada permanentemente</title>
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
                  <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:4px;margin-bottom:20px;">
                    <h2 style="margin:0;color:#dc2626;font-size:18px;">🗑️ Solicitud eliminada permanentemente</h2>
                  </div>
                  <p style="color:#555;line-height:1.6;">
                    Han transcurrido <strong>15 días</strong> desde que la siguiente solicitud fue marcada como eliminada,
                    por lo que ha sido removida definitivamente de nuestro sistema:
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
                    <p style="margin:0;font-weight:600;color:#111827;font-size:15px;">${requestTitle}</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">
                      Motivo de eliminación: <em>"${deletedReason || 'No especificado'}"</em>
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color:#555;line-height:1.6;">
                    Si no estás de acuerdo con la respuesta recibida o necesitas retomar este tema,
                    puedes abrir una nueva solicitud haciendo clic en el botón a continuación:
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:20px 0;">
                  <a href="${newRequestUrl}"
                    style="background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:bold;font-size:15px;">
                    Crear nueva solicitud
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color:#9ca3af;font-size:12px;line-height:1.5;">
                    Este registro fue eliminado definitivamente de acuerdo con nuestra política de retención de datos
                    (15 días tras la eliminación). Si crees que esto es un error, contacta a soporte.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="border-top:1px solid #eee;padding-top:20px;">
                  <p style="font-size:12px;color:#999;text-align:center;">
                    © ${new Date().getFullYear()} ${companyName}.
                    Soporte:
                    <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">${supportEmail}</a>
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

module.exports = {
  sendPasswordResetEmail,
  sendPurgeNotificationEmail
};