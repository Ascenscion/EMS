import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import db from "../src/models/index.js";
import { login } from "../src/modules/auth/auth.controller.js";
import {
    AUTH_COOKIE_NAME,
    MANAGEMENT_ROLES,
    ROLE_IDS,
    clearAuthCookie,
    requireAuth,
    requireRoles,
    requireSelfOrRoles,
    setAuthCookie,
    signAuthToken
} from "../src/modules/auth/auth.middleware.js";
import {
    LOGIN_MAX_ATTEMPTS,
    LOGIN_WINDOW_SECONDS,
    consumeLoginAttempt,
    getLoginRateLimitKey
} from "../src/modules/auth/loginRateLimiter.js";

process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

function createContext(overrides = {}) {
    return {
        headers: {},
        cookie: {},
        request: {
            method: "GET",
        },
        set: {},
        ...overrides,
    };
}

function createUser(overrides = {}) {
    return {
        id: 10,
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        role_id: ROLE_IDS.STAFF,
        department_id: 1,
        is_active: true,
        ...overrides,
    };
}

function withMockedUser(methodName, implementation, callback) {
    const original = db.User[methodName];
    db.User[methodName] = implementation;

    return Promise.resolve(callback()).finally(() => {
        db.User[methodName] = original;
    });
}

test("login sets an httpOnly auth cookie and does not return the raw token", async () => {
    const passwordHash = await bcrypt.hash("CorrectPass123!", 4);
    const user = createUser({
        email: "admin@example.com",
        password_hash: passwordHash,
        role_id: ROLE_IDS.ADMIN,
    });

    await withMockedUser("findOne", async ({ where }) => {
        assert.equal(where.email, "admin@example.com");
        return user;
    }, async () => {
        const set = {};
        const response = await login({
            body: {
                email: " ADMIN@example.com ",
                password: "CorrectPass123!",
            },
            set,
        });

        assert.equal(response.message, "Login successful");
        assert.equal(response.token, undefined);
        assert.equal(response.user.email, "admin@example.com");
        assert.equal(set.cookie[AUTH_COOKIE_NAME].httpOnly, true);
        assert.equal(set.cookie[AUTH_COOKIE_NAME].sameSite, "lax");
        assert.equal(typeof set.cookie[AUTH_COOKIE_NAME].value, "string");
    });
});

test("login rejects inactive users after validating credentials", async () => {
    const passwordHash = await bcrypt.hash("CorrectPass123!", 4);
    const user = createUser({
        password_hash: passwordHash,
        is_active: false,
    });

    await withMockedUser("findOne", async () => user, async () => {
        const set = {};
        const response = await login({
            body: {
                email: "inactive@example.com",
                password: "CorrectPass123!",
            },
            set,
        });

        assert.equal(set.status, 403);
        assert.equal(response.message, "User account is inactive");
        assert.equal(set.cookie, undefined);
    });
});

test("requireAuth accepts the httpOnly cookie token and hydrates authUser from the database", async () => {
    const user = createUser({
        id: 42,
        role_id: ROLE_IDS.MASTER,
    });
    const token = signAuthToken(user);

    await withMockedUser("findByPk", async (id) => {
        assert.equal(id, 42);
        return user;
    }, async () => {
        const context = createContext({
            cookie: {
                [AUTH_COOKIE_NAME]: {
                    value: token,
                },
            },
        });

        const result = await requireAuth(context);

        assert.equal(result, undefined);
        assert.equal(context.authUser.id, 42);
        assert.equal(context.authUser.role_id, ROLE_IDS.MASTER);
    });
});

test("requireRoles rejects authenticated users without an allowed role", async () => {
    const user = createUser({
        id: 12,
        role_id: ROLE_IDS.STAFF,
    });
    const token = signAuthToken(user);

    await withMockedUser("findByPk", async () => user, async () => {
        const guard = requireRoles(MANAGEMENT_ROLES);
        const context = createContext({
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        const result = await guard(context);

        assert.equal(context.set.status, 403);
        assert.equal(result.message, "You do not have permission to perform this action");
    });
});

test("requireAuth rejects unsafe cookie-authenticated requests from untrusted origins", async () => {
    const user = createUser({
        id: 18,
        role_id: ROLE_IDS.STAFF,
    });
    const token = signAuthToken(user);

    await withMockedUser("findByPk", async () => user, async () => {
        const context = createContext({
            cookie: {
                [AUTH_COOKIE_NAME]: {
                    value: token,
                },
            },
            headers: {
                origin: "https://evil.example",
            },
            request: {
                method: "POST",
            },
        });

        const result = await requireAuth(context);

        assert.equal(context.set.status, 403);
        assert.equal(result.message, "Request origin is not allowed");
    });
});

test("requireSelfOrRoles allows users to access their own user-scoped resource", async () => {
    const user = createUser({
        id: 15,
        role_id: ROLE_IDS.STAFF,
    });
    const token = signAuthToken(user);

    await withMockedUser("findByPk", async () => user, async () => {
        const guard = requireSelfOrRoles(({ params }) => params.id, MANAGEMENT_ROLES);
        const context = createContext({
            headers: {
                authorization: `Bearer ${token}`,
            },
            params: {
                id: "15",
            },
        });

        const result = await guard(context);

        assert.equal(result, undefined);
        assert.equal(context.set.status, undefined);
    });
});

test("auth cookie helpers set and clear secure httpOnly cookie attributes", () => {
    const set = {};

    setAuthCookie(set, "token-value");

    assert.equal(set.cookie[AUTH_COOKIE_NAME].value, "token-value");
    assert.equal(set.cookie[AUTH_COOKIE_NAME].httpOnly, true);
    assert.equal(set.cookie[AUTH_COOKIE_NAME].path, "/");

    clearAuthCookie(set);

    assert.equal(set.cookie[AUTH_COOKIE_NAME].value, "");
    assert.equal(set.cookie[AUTH_COOKIE_NAME].maxAge, 0);
});

test("Redis login limiter allows up to the configured number of attempts", async () => {
    const calls = [];
    let count = 0;
    const fakeRedis = {
        async incr(key) {
            calls.push(["incr", key]);
            count += 1;
            return count;
        },
        async expire(key, seconds) {
            calls.push(["expire", key, seconds]);
        },
    };

    const key = getLoginRateLimitKey({
        ip: "127.0.0.1",
        email: "User@Example.com",
    });

    for (let attempt = 1; attempt <= LOGIN_MAX_ATTEMPTS; attempt += 1) {
        const result = await consumeLoginAttempt(fakeRedis, key);
        assert.equal(result.allowed, true);
    }

    const blocked = await consumeLoginAttempt(fakeRedis, key);

    assert.equal(blocked.allowed, false);
    assert.deepEqual(calls[1], ["expire", key, LOGIN_WINDOW_SECONDS]);
});
