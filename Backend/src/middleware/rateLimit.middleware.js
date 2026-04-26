/**
 * Rate Limiting Middleware
 *
 * Protects API from abuse, brute force, and DDoS attacks.
 * Uses in-memory store (sufficient for single-instance Render free tier).
 * For multi-instance production: switch to Redis store via rate-limiter-flexible.
 *
 * Limits applied:
 * - Auth endpoints: 5 attempts per 15 min (prevents password brute force)
 * - General API: 100 req/min (prevents DDoS)
 * - Public endpoints: 30 req/min (job listing, search)
 *
 * @author Bipin Devkota
 */

import rateLimit from 'express-rate-limit'

/**
 * Strict limiter for sensitive auth endpoints (login, register, password reset).
 * After 5 failed attempts, IP blocked for 15 minutes.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,        // 15 minutes
    max: 5,                           // 5 attempts per window
    message: {
        error: 'TOO_MANY_AUTH_ATTEMPTS',
        message: 'Too many login attempts. Try again in 15 minutes.'
    },
    standardHeaders: true,            // Send RateLimit-* headers
    legacyHeaders: false,             // Disable X-RateLimit-* headers
    skipSuccessfulRequests: true      // Don't count successful logins
})

/**
 * Standard limiter for authenticated API endpoints.
 * 100 requests per minute per IP.
 */
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,              // 1 minute
    max: 100,                         // 100 requests per minute
    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false
})

/**
 * Lenient limiter for public read endpoints (job search, listings).
 * 30 requests per minute — accounts for users browsing.
 */
export const publicLimiter = rateLimit({
    windowMs: 60 * 1000,              // 1 minute
    max: 30,
    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false
})

/**
 * Strict limiter for write operations (POST/PUT/DELETE).
 * 20 writes per minute prevents spam and accidental loops.
 */
export const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        error: 'WRITE_LIMIT_EXCEEDED',
        message: 'Too many write operations. Please wait.'
    },
    standardHeaders: true,
    legacyHeaders: false
})