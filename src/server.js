require('dotenv').config();

const app = require('./app');
const { startCleanupJob } = require('./shared/jobs/cleanup.job');
const { startPurgeJob } = require('./requests/request.purge');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  startCleanupJob();
  startPurgeJob();
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});