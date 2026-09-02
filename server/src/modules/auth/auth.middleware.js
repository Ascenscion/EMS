import jwt from "jsonwebtoken";
import db from "../../models/index.js";

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
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const loginAttempts = new Map();

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

export async function requireAuth(context) {
    const { headers, set } = context;
    const token = getBearerToken(headers);

    if (!token) {
        return authError(set, 401, "Authentication required");
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

export function rateLimitLogin({ body, headers, set }) {
    const forwardedFor = headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const ip = forwardedFor || headers["x-real-ip"] || "unknown";
    const email = body.email?.trim().toLowerCase() || "unknown";
    const key = `${ip}:${email}`;
    const now = Date.now();
    const record = loginAttempts.get(key);

    if (!record || now > record.resetAt) {
        loginAttempts.set(key, {
            count: 1,
            resetAt: now + LOGIN_WINDOW_MS,
        });
        return;
    }

    if (record.count >= LOGIN_MAX_ATTEMPTS) {
        set.status = 429;
        return {
            message: "Too many login attempts. Please try again later.",
        };
    }

    record.count += 1;
    loginAttempts.set(key, record);
}
