require('dotenv').config();

const app = require('./app');
const { startCleanupJob } = require('./shared/jobs/cleanup.job');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  startCleanupJob();
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
