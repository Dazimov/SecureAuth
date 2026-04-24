import { rateLimit } from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

import { redis } from '../../config/redis'
import { TIMESPAN } from '../../constants/time'
import { RateLimitError } from '../../errors'
import { MESSAGES } from '../../constants/messages'

// Default/general rate limit
const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]): Promise<unknown> => redis.call(...args)
  }),
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new RateLimitError(MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10)
  }
})

const rateLimitOncePerTenMins = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]): Promise<unknown> => redis.call(...args)
  }),
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 1,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new RateLimitError(MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10)
  }
})

const rateLimitTenPerTenMins = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]): Promise<unknown> => redis.call(...args)
  }),
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new RateLimitError(MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10)
  }
})

export default rateLimiter

export { rateLimiter, rateLimitOncePerTenMins, rateLimitTenPerTenMins }
