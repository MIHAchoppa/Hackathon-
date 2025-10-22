const morgan = require('morgan');
const config = require('../config');

// Custom token for response time
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '';
  }
  
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  
  return ms.toFixed(3);
});

// Custom format
const logFormat = config.nodeEnv === 'development'
  ? ':method :url :status :response-time ms - :res[content-length]'
  : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

const logger = morgan(logFormat);

module.exports = logger;
