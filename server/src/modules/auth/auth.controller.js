import bcrypt from "bcrypt";
import db from "../../models/index.js"
import {
    clearAuthCookie,
    getTokenExpiresIn,
    serializeAuthUser,
    setAuthCookie,
    signAuthToken
} from "./auth.middleware.js";

const { User } = db;

export async function login({ body, set }) {
    try {
        const { password } = body
        const email = body.email?.trim().toLowerCase();

        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            set.status = 401
            return { message: "Invalid email or password" }
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        )

        if (!passwordMatches) {
            set.status = 401
            return { message: "Invalid email or password" }
        }

        if (!user.is_active) {
            set.status = 403
            return { message: "User account is inactive" }
        }

        const token = signAuthToken(user);
        setAuthCookie(set, token);

        return {
            message: "Login successful",
            expires_in: getTokenExpiresIn(),
            user: serializeAuthUser(user)
        }
    } catch (error) {
        console.error("Error logging in:", error.message);
        set.status = 500;
        return { message: "Could not log in" };
    }
}

export function me({ authUser }) {
    return { user: authUser };
}

export function logout({ set }) {
    clearAuthCookie(set);
    return { message: "Logout successful" };
}
