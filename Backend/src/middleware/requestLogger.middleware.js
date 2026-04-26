/**
 * Request Logger Middleware
 *
 * Logs every incoming HTTP request with:
 * - Unique request ID (for tracing across logs)
 * - Method, URL, status, duration
 * - User ID (if authenticated)
 *
 * Slow request warning: logs error level if >1000ms.
 */

import pinoHttp from 'pino-http'
import { v4 as uuidv4 } from 'uuid'
import logger from '../config/logger.js'

export const requestLogger = pinoHttp({
    logger,

    // Generate unique request ID for tracing
    genReqId: (req) => req.headers['x-request-id'] || uuidv4(),

    // Custom log level based on response
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        if (res.responseTime > 1000) return 'warn'
        return 'info'
    },

    // Compact log shape
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            userId: req.user?._id?.toString()
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    },

    // Skip noisy health checks in production
    autoLogging: {
        ignore: (req) => req.url === '/api/health'
    }
})