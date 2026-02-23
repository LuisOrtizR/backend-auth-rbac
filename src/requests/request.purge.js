const cron = require('node-cron');
const { purgeExpiredRequests } = require('./request.service');
const { sendPurgeNotificationEmail } = require('../shared/services/email.service');

const runPurge = async () => {
  console.log('🧹 [PURGE] Iniciando purga de solicitudes eliminadas...');

  try {
    const purged = await purgeExpiredRequests(sendPurgeNotificationEmail);

    if (purged === 0) {
      console.log('✅ [PURGE] No hay solicitudes que cumplan 15 días eliminadas.');
    } else {
      console.log(`✅ [PURGE] ${purged} solicitud(es) purgadas y notificadas.`);
    }
  } catch (err) {
    console.error('❌ [PURGE] Error en el proceso de purga:', err);
  }
};

const startPurgeJob = () => {
  cron.schedule('0 2 * * *', runPurge, {
    timezone: 'America/Bogota'
  });

  console.log('⏰ [PURGE] Cron activo — purga diaria a las 2:00 AM (Bogotá)');
};

module.exports = { startPurgeJob, runPurge };