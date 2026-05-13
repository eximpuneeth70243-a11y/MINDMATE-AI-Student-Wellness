import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: '❌',
  WARN: '⚠️',
  INFO: 'ℹ️',
  DEBUG: '🐛'
};

const getTimestamp = () => new Date().toISOString();

const writeLog = (level, message, data = '') => {
  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] ${logLevels[level]} ${level}: ${message} ${data}`;
  
  // Console log
  console.log(logMessage);
  
  // File log
  const logFile = path.join(logsDir, 'app.log');
  fs.appendFileSync(logFile, logMessage + '\n');
};

const logger = {
  error: (message, data = '') => writeLog('ERROR', message, data),
  warn: (message, data = '') => writeLog('WARN', message, data),
  info: (message, data = '') => writeLog('INFO', message, data),
  debug: (message, data = '') => writeLog('DEBUG', message, data)
};

export default logger;