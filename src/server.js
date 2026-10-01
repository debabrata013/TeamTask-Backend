const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      console.log(`[TeamTask Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    const handleShutdown = (signal) => {
      console.log(`[TeamTask Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[TeamTask Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[TeamTask Server Start Error]', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
