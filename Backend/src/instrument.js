import 'dotenv/config'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    debug: true,  // ← ADD THIS
    ignoreErrors: ['Token invalid', 'Not authorized', 'VALIDATION_FAILED'],
    beforeSend(event) {
        if (event.request?.data?.password) event.request.data.password = '[REDACTED]'
        if (event.request?.headers?.authorization) event.request.headers.authorization = '[REDACTED]'
        return event
    }
})

console.log('[Sentry] DSN configured:', process.env.SENTRY_DSN ? 'YES' : 'NO')

export default Sentry