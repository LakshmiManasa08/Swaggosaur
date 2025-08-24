require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  QWEN3_MODEL: process.env.QWEN3_MODEL || 'qwen/qwen3-coder',
  UPLOADS_PATH: process.env.UPLOADS_PATH || 'uploads',
  RESULTS_PATH: process.env.RESULTS_PATH || 'results',
  ALLOWED_EXTENSIONS: (process.env.ALLOWED_EXTENSIONS || '.json,.yaml,.yml').split(',').map(ext => ext.trim().toLowerCase()),
  CORS_ORIGINS: '*',
  AI_TIMEOUT: parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 60000,
  UPLOAD_TIMEOUT: parseInt(process.env.UPLOAD_TIMEOUT_MS, 10) || 30000,
};
