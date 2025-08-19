const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const testConfig = require('./test.config');

class MajesticServer {
  constructor() {
    this.app = express();
    this.port = testConfig.env.MAJESTIC_PORT || 4000;
    this.rootPath = testConfig.env.MAJESTIC_ROOT_PATH || '/Tests';
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Basic authentication for all routes
    this.app.use(basicAuth({
      users: {
        [testConfig.env.TEST_USER]: testConfig.env.TEST_PASSWORD
      },
      challenge: true,
      realm: 'Majestic Test UI'
    }));

    // Parse JSON bodies
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Majestic Test UI is running',
        timestamp: new Date().toISOString(),
        config: {
          port: this.port,
          rootPath: this.rootPath,
          testUser: testConfig.env.TEST_USER
        }
      });
    });

    // Test dashboard landing page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/test-dashboard.html'));
    });

    // Majestic UI at /Tests path
    this.app.get('/Tests', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Majestic Test UI</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
                .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🧪 Majestic Test UI</h1>
                <div class="info">
                    <h3>Test Configuration</h3>
                    <p><strong>Username:</strong> ${testConfig.env.TEST_USER}</p>
                    <p><strong>Password:</strong> ${testConfig.env.TEST_PASSWORD}</p>
                    <p><strong>Port:</strong> ${this.port}</p>
                </div>
                <a href="/" class="btn">← Back to Dashboard</a>
                <a href="/health" class="btn">Health Check</a>
                <div style="margin-top: 30px;">
                    <h3>Available Test Commands:</h3>
                    <ul>
                        <li><code>npm run test:unit</code> - Unit tests</li>
                        <li><code>npm run test:integration</code> - Integration tests</li>
                        <li><code>npm run test:e2e</code> - E2E tests</li>
                        <li><code>npm run test:all</code> - All tests with report</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
      `);
    });

    // Health check at /Tests/health
    this.app.get('/Tests/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Majestic Test UI is running',
        timestamp: new Date().toISOString(),
        config: {
          port: this.port,
          rootPath: this.rootPath,
          testUser: testConfig.env.TEST_USER
        }
      });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`🚀 Majestic Test UI running at http://localhost:${this.port}`);
          console.log(`🔐 Authentication: ${testConfig.env.TEST_USER} / ${testConfig.env.TEST_PASSWORD}`);
          console.log(`📊 Test Dashboard: http://localhost:${this.port}`);
          console.log(`🎯 Majestic UI: http://localhost:${this.port}${this.rootPath}`);
          resolve();
        }
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 Majestic Test UI stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Export for use in other files
module.exports = MajesticServer;

// Start server if this file is run directly
if (require.main === module) {
  const server = new MajesticServer();
  server.start().catch(console.error);
}
