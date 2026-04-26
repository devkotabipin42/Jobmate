/**
 * Application Logger Configuration
 *
 * Pino-based structured logger.
 * - Development: pretty colored console output
 * - Production: JSON output for log aggregators
 * - Sensitive fields automatically redacted
 *
 * Usage:
 *   import logger from '../config/logger.js'
 *   logger.info({ userId: user._id }, 'User logged in')
 *   logger.error({ err }, 'Failed to process payment')
 */

import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',

    // Sensitive fields automatically replaced with [REDACTED]
    redact: {
        paths: [
            'password',
            'token',
            'authorization',
            '*.password',
            '*.token',
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'res.headers["set-cookie"]'
        ],
        censor: '[REDACTED]'
    },

    // Pretty print in development only
    transport: isDev ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname'
        }
    } : undefined,

    // Production: include hostname and process ID for distributed debugging
    base: isDev ? {} : {
        env: process.env.NODE_ENV,
        version: process.env.npm_package_version
    }
})

export default logger