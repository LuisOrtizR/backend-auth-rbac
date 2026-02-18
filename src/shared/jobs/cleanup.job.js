const pool = require('../config/db');

const cleanExpiredResetTokens = async () => {
  try {
    await pool.query(
      'DELETE FROM password_resets WHERE expires_at < NOW()'
    );
  } catch (error) {}
};

const startCleanupJob = () => {
  cleanExpiredResetTokens();
  setInterval(cleanExpiredResetTokens, 1000 * 60 * 60);
};

module.exports = { startCleanupJob };
