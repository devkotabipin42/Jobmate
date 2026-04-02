import { createClient } from 'redis'

export let isRedisConnected = false

const client = createClient({
    url: process.env.REDIS_URL
})

client.on('error', () => { isRedisConnected = false })
client.on('ready', () => {
    isRedisConnected = true
    console.log('Redis connected!')
})

client.connect().catch(() => {
    console.log('Redis not available — running without cache')
})

export default client