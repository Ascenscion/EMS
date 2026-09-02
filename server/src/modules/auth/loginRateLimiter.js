import crypto from "crypto";

export const LOGIN_WINDOW_SECONDS = 15 * 60;
export const LOGIN_MAX_ATTEMPTS = 5;

export function getLoginRateLimitKey({ ip, email }) {
    const normalizedEmail = email?.trim().toLowerCase() || "unknown";
    const normalizedIp = ip || "unknown";
    const digest = crypto
        .createHash("sha256")
        .update(`${normalizedIp}:${normalizedEmail}`)
        .digest("hex");

    return `auth:login:${digest}`;
}

export async function consumeLoginAttempt(redisClient, key) {
    const attempts = await redisClient.incr(key);

    if (attempts === 1) {
        await redisClient.expire(key, LOGIN_WINDOW_SECONDS);
    }

    return {
        allowed: attempts <= LOGIN_MAX_ATTEMPTS,
        attempts,
    };
}
