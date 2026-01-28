import { Redis } from '@upstash/redis';

/**
 * TECHNICAL SERVICE: FIELD SUPPORT CACHE (UPSTASH REDIS)
 * 
 * Purpose: Handle high-frequency data (Likes, Hot Feed) to avoid 
 * database bottlenecking and reduce operational costs.
 */

const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis only if credentials exist
let redis: Redis | null = null;
if (REDIS_URL && REDIS_TOKEN) {
    redis = new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
    });
}

/**
 * Signal Boost (Like) Management
 * Atomically increments the signal strength in Redis first.
 */
export const boostSignal = async (postId: string): Promise<number | null> => {
    if (!redis) return null;
    const key = `post:${postId}:strength`;
    return await redis.incr(key);
};

export const getSignalStrength = async (postId: string): Promise<number> => {
    if (!redis) return 0;
    const key = `post:${postId}:strength`;
    const val = await redis.get<number>(key);
    return val || 0;
};

/**
 * Hot Feed Cache
 * Stores the latest broadcast results for rapid mobile retrieval.
 */
export const cacheFeed = async (feedData: any): Promise<void> => {
    if (!redis) return;
    await redis.set('community:hot_feed', feedData, { ex: 300 }); // 5 min expiry
};

export const getCachedFeed = async (): Promise<any | null> => {
    if (!redis) return null;
    return await redis.get('community:hot_feed');
};

export const invalidateFeed = async (): Promise<void> => {
    if (!redis) return;
    await redis.del('community:hot_feed');
};

/**
 * Rate Limiting Logic (Simplified for Repair Community)
 * Prevents signal Spam from single transmissions.
 */
export const checkRateLimit = async (userId: string, action: string): Promise<boolean> => {
    if (!redis) return true;
    const key = `limit:${userId}:${action}`;
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, 60); // 1 minute window
    }
    return count <= 5; // Max 5 broadcasts/signal-boosts per minute
};
