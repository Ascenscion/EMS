import bcrypt from "bcrypt";
import db from "../../models/index.js"
import crypto from "crypto";

const { User } = db;

export async function login({ body, set }) {
    const { email, password } = body

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

    return {
        message: "Login successful",
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id,
            department_id: user.department_id
        }
    }
}