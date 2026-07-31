import app from './app.js';
import config from './config/index.js';

app.listen(config.port, () => {
  console.log(`✅ TaskForge API running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.env}`);
});
