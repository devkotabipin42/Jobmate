/**
 * Global error handler middleware.
 * Catches all unhandled errors and returns sanitized responses.
 *
 * In dev: full error details for debugging.
 * In production: generic codes only — no schema/stack leak.
 */

export const errorHandler = (err, req, res, next) => {
    // Log full error server-side (also reaches Sentry)
    console.error('[Error]', {
        method: req.method,
        path: req.path,
        message: err.message,
        stack: err.stack
    })

    const isDev = process.env.NODE_ENV !== 'production'

    // Mongoose validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'VALIDATION_FAILED',
            ...(isDev && { details: err.message })
        })
    }

    // Mongoose cast (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'INVALID_INPUT',
            ...(isDev && { details: err.message })
        })
    }

    // Duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            error: 'DUPLICATE_ENTRY',
            ...(isDev && { details: err.message })
        })
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'INVALID_TOKEN' })
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'TOKEN_EXPIRED' })
    }

    // Default
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        error: err.code || 'INTERNAL_ERROR',
        ...(isDev && { message: err.message, stack: err.stack })
    })
}

/**
 * 404 handler for unknown routes.
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'ROUTE_NOT_FOUND',
        path: req.path
    })
}