import { createApp } from './app';
import { testConnection } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

async function main() {
  // Verify DB connection before starting
  await testConnection();

  const app = createApp();
  const port = parseInt(env.PORT, 10);

  app.listen(port, () => {
    logger.info(`🚀 Work-Sure API listening on port ${port} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  logger.error('Failed to start server', { error: err.message, stack: err.stack });
  process.exit(1);
});
