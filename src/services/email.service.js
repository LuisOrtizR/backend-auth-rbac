const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste esto, ignora este correo.</p>
    `
  });
};

module.exports = { sendPasswordResetEmail };
