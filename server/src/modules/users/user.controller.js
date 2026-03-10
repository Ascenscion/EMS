import bcrypt from "bcrypt";
import User from "../../models/User";
import { where } from "sequelize";

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
    if (!user) {
        return { error: "User not found." }
    }
    return user;
}

export async function updateUser({ params, body }) {
    const user = await User.findByPk(params.id);

    if (!user) {
        return { error: "User not found" }
    }

    await user.update(body);
    const updatedUser = user.toJSON();
    delete updatedUser.password_hash;

    return updatedUser;
}

export async function deleteUser({ params }) {
    const user = User.findByPk(params.id);

    if (!user) {
        return { error: "User not found" }
    }

    await user.destroy();
    return { message: "User deleted." }
}