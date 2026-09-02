import { createClient } from "redis";

let redisClient;
let redisConnection;

export function getRedisUrl() {
    return process.env.REDIS_URL || "redis://localhost:6379";
}

export async function getRedisClient() {
    if (redisClient?.isOpen) {
        return redisClient;
    }

    if (!redisConnection) {
        redisClient = createClient({
            url: getRedisUrl(),
            socket: {
                connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 2000),
                reconnectStrategy: false,
            },
        });

        redisClient.on("error", (error) => {
            console.error("Redis connection error:", error.message);
        });

        redisConnection = redisClient.connect().catch((error) => {
            redisConnection = undefined;
            redisClient = undefined;
            throw error;
        });
    }

    await redisConnection;
    return redisClient;
}
