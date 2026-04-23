import bcrypt from "bcrypt";
import db from "../../models/index.js"
import { where } from "sequelize";
const { User } = db;

export async function createUser({ body }) {
    const { password, email } = body;

    //Check if user exists.
    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        return { error: "Email already registered" };
    }

    //Hash pw
    const password_hash = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
        ...body,
        password_hash,
        role_id: 2
    });

    //Remove pw from response
    const userData = user.toJSON();
    delete userData.password_hash;

    return userData;
}

export async function getAllUsers() {
    const users = await User.findAll({
        attributes: { exclude: ["password_hash"] }
    });
    return users;
}

export async function getUser({ params }) {
    const user = await User.findByPk(params.id, {
        attributes: { exclude: ["password_hash"] }
    });
    console.log("USER", user);
    console.log("PARAMS", params.id);
    if (!user) {
        return { error: "User not found." }
    }
    return user;
}

export async function updateUser({ params, body }) {
    const user = await User.findByPk(params.id);
    if (!user) {
        return { error: "User not found" };
    }
    Object.keys(body).forEach(key => {
        if (body[key] === "") delete body[key];
    });

    if (body.password) {
        body.password_hash = await bcrypt.hash(body.password, 10)
        delete body.password;
    }

    await user.update(body);
    const updatedUser = user.toJSON();
    delete updatedUser.password_hash;
    return updatedUser;
}

export async function deleteUser({ params, set }) {
    try {
        const deleted = await User.destroy({
            where: { id: params.id }
        });

        if (!deleted) {
            set.status = 404;
            return {
                type: "not_found",
                message: "User not found,"
            }
        }
        return {
            type: "success",
            message: "User deleted successfully"
        }
    } catch (error) {
        console.error("Delete user error: ", error);

        const errorMessage =
            error?.original?.message ||
            error?.parent?.message ||
            error?.message ||
            String(error);

        if (errorMessage.includes("REFERENCE constraint") ||
            errorMessage.includes("conflicted with the REFERENCE constraint")) {
            set.status = 409;
            return {
                type: "reference_constraint",
                message: "This user cannot be deleted because they have related records"
            }
        }

        set.status = 500
        return {
            type: "server_error",
            message: "Something went wrong while deleting the user."
        }
    }
}