console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "CARGADA" : "NO CARGADA");

const { sendPasswordResetEmail } = require('./services/email.service');

sendPasswordResetEmail(
  process.env.EMAIL_USER,
  'TOKEN_DE_PRUEBA_123'
)
  .then((info) => {
    console.log('Email enviado correctamente');
    console.log(info.response);
  })
  .catch((error) => {
    console.error('ERROR DETALLADO:');
    console.error(error);
  });
