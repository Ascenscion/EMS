import bcrypt from "bcrypt";
import db from "../../models/index.js"
import crypto from "crypto";

const { User, Role, Department } = db;

function generateTempPassword() {
    return crypto.randomBytes(8).toString("hex");
}

export async function createUser({ body, set }) {
    try {
        const { email } = body;

        //Check if user exists.
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            set.status = 409;
            return { error: "Email already registered" };
        }

        //DOB Validation
        const dob = new Date(body.dob);
        const today = new Date();

        if (dob > today) {
            set.status = 400;
            return {
                error: "Date of birth cannot be in the future",
            };
        }

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            set.status = 400;
            return {
                error: "User must be at least 18 years old",
            };
        }

        if (age > 100) {
            set.status = 400;
            return {
                error: "Please enter a valid date of birth",
            };
        }

        //ROLE & DEPARTMENT VALIDATIONS
        const role = await Role.findByPk(body.role_id);
        if (!role) {
            set.status = 400;
            return { error: "Invalid role selected" };
        }

        const department = await Department.findByPk(body.department_id);
        if (!department) {
            set.status = 400;
            return { error: "Invalid department selected" };
        }

        const password = generateTempPassword();
        //VIEW PASSWORD
        console.log("PASSWORD", password);
        //Hash pw
        const password_hash = await bcrypt.hash(password, 10);

        const payload = {
            ...body,
            middle_name: body.middle_name?.trim() || null,
            emergency_contact: body.emergency_contact?.trim() || null,
            emergency_phone: body.emergency_phone?.trim() || null,
            password_hash,
            role_id: body.role_id
        }

        //create user
        const user = await User.create(payload);

        //Remove pw from response
        const userData = user.toJSON();
        delete userData.password_hash;

        return userData;
    } catch (error) {
        console.error("Error creating user:", error);
        set.status = 500;
        return {
            error: "Could not create user",
            details: error.message,
        };
    }
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

export async function updateUser({ params, body, set }) {
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