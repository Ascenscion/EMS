import jwt from "jsonwebtoken";
import { getRedisClient } from "../../config/redis.js";
import db from "../../models/index.js";
import {
    consumeLoginAttempt,
    getLoginRateLimitKey
} from "./loginRateLimiter.js";

const { User } = db;

export const ROLE_IDS = Object.freeze({
    ADMIN: 1,
    STAFF: 2,
    MASTER: 3,
});

export const MANAGEMENT_ROLES = [ROLE_IDS.ADMIN, ROLE_IDS.MASTER];
export const STAFF_ROLES = [ROLE_IDS.STAFF, ROLE_IDS.MASTER];
export const AUTHENTICATED_ROLES = [
    ROLE_IDS.ADMIN,
    ROLE_IDS.STAFF,
    ROLE_IDS.MASTER,
];

const TOKEN_EXPIRES_IN = "8h";
const TOKEN_EXPIRES_IN_SECONDS = 8 * 60 * 60;
export const AUTH_COOKIE_NAME = "ems_session";

function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
    }

    return process.env.JWT_SECRET;
}

export function signAuthToken(user) {
    return jwt.sign(
        {
            role_id: user.role_id,
            department_id: user.department_id,
        },
        getJwtSecret(),
        {
            subject: String(user.id),
            expiresIn: TOKEN_EXPIRES_IN,
        }
    );
}

export function getTokenExpiresIn() {
    return TOKEN_EXPIRES_IN_SECONDS;
}

export function serializeAuthUser(user) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        department_id: user.department_id,
        is_active: user.is_active,
    };
}

function shouldUseSecureCookie() {
    return process.env.AUTH_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
}

function getCookieSameSite() {
    const sameSite = process.env.AUTH_COOKIE_SAME_SITE?.toLowerCase();

    if (["lax", "strict", "none"].includes(sameSite)) {
        return sameSite;
    }

    return "lax";
}

function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: shouldUseSecureCookie(),
        sameSite: getCookieSameSite(),
        path: "/",
        maxAge: TOKEN_EXPIRES_IN_SECONDS,
    };
}

export function setAuthCookie(set, token) {
    set.cookie = {
        ...(set.cookie || {}),
        [AUTH_COOKIE_NAME]: {
            ...getAuthCookieOptions(),
            value: token,
        },
    };
}

export function clearAuthCookie(set) {
    set.cookie = {
        ...(set.cookie || {}),
        [AUTH_COOKIE_NAME]: {
            ...getAuthCookieOptions(),
            value: "",
            maxAge: 0,
        },
    };
}

function authError(set, status, message) {
    set.status = status;
    return { message };
}

function getBearerToken(headers) {
    const authorization = headers.authorization || headers.Authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return null;
    }

    return authorization.slice("Bearer ".length).trim();
}

function getCookieToken(cookie) {
    const token = cookie?.[AUTH_COOKIE_NAME]?.value;

    return typeof token === "string" && token.trim() ? token.trim() : null;
}

function getAuthToken({ cookie, headers }) {
    const cookieToken = getCookieToken(cookie);
    if (cookieToken) {
        return {
            token: cookieToken,
            source: "cookie",
        };
    }

    const bearerToken = getBearerToken(headers);
    if (bearerToken) {
        return {
            token: bearerToken,
            source: "bearer",
        };
    }

    return {
        token: null,
        source: null,
    };
}

function isUnsafeMethod(method) {
    return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function isTrustedOrigin(origin) {
    if (!origin) {
        return true;
    }

    const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return allowedOrigins.includes(origin);
}

export async function requireAuth(context) {
    const { cookie, headers, request, set } = context;
    const { token, source } = getAuthToken({ cookie, headers });

    if (!token) {
        return authError(set, 401, "Authentication required");
    }

    const origin = headers.origin;
    if (source === "cookie" && isUnsafeMethod(request.method) && !isTrustedOrigin(origin)) {
        return authError(set, 403, "Request origin is not allowed");
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());
        const userId = Number(payload.sub);

        if (!userId || Number.isNaN(userId)) {
            return authError(set, 401, "Invalid authentication token");
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return authError(set, 401, "Invalid authentication token");
        }

        if (!user.is_active) {
            return authError(set, 403, "User account is inactive");
        }

        context.authUser = serializeAuthUser(user);
    } catch (error) {
        return authError(set, 401, "Invalid or expired authentication token");
    }
}

export function requireRoles(allowedRoles) {
    return async (context) => {
        const authResult = await requireAuth(context);
        if (authResult) return authResult;

        if (!allowedRoles.includes(Number(context.authUser.role_id))) {
            return authError(context.set, 403, "You do not have permission to perform this action");
        }
    };
}

export function requireSelfOrRoles(getTargetUserId, allowedRoles) {
    return async (context) => {
        const authResult = await requireAuth(context);
        if (authResult) return authResult;

        const authUser = context.authUser;
        const targetUserId = Number(getTargetUserId(context));

        if (allowedRoles.includes(Number(authUser.role_id)) || authUser.id === targetUserId) {
            return;
        }

        return authError(context.set, 403, "You do not have permission to access this user");
    };
}

export async function rateLimitLogin({ body, headers, set }) {
    const forwardedFor = headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const ip = forwardedFor || headers["x-real-ip"] || "unknown";
    const email = body.email?.trim().toLowerCase() || "unknown";
    const key = getLoginRateLimitKey({ ip, email });

    try {
        const redisClient = await getRedisClient();
        const result = await consumeLoginAttempt(redisClient, key);

        if (!result.allowed) {
            set.status = 429;
            return {
                message: "Too many login attempts. Please try again later.",
            };
        }
    } catch (error) {
        console.error("Login rate limiter unavailable:", error.message);
        set.status = 503;
        return {
            message: "Authentication is temporarily unavailable",
        };
    }
}
