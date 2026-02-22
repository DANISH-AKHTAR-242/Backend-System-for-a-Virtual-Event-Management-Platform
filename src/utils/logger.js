const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const LogLevel = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

const formatTimestamp = () => {
    return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
    const timestamp = formatTimestamp();
    const logEntry = {
        timestamp,
        level,
        message,
        ...(data && { data })
    };
    return JSON.stringify(logEntry);
};

const writeLog = (level, message, data) => {
    const logMessage = formatLog(level, message, data);
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    
    fs.appendFileSync(logFile, logMessage + '\n');
};

const logger = {
    error: (message, data) => {
        console.error(`[ERROR] ${message}`, data || '');
        writeLog(LogLevel.ERROR, message, data);
    },

    warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data || '');
        writeLog(LogLevel.WARN, message, data);
    },

    info: (message, data) => {
        console.log(`[INFO] ${message}`, data || '');
        writeLog(LogLevel.INFO, message, data);
    },

    debug: (message, data) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${message}`, data || '');
            writeLog(LogLevel.DEBUG, message, data);
        }
    }
};

module.exports = logger;