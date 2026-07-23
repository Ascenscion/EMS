import bcrypt from "bcrypt";
import db from "../../models/index.js"
import crypto from "crypto";
import { error } from "console";
import { Model, where } from "sequelize";
import { type } from "os";

const { User, Role, Department, Application } = db;

function generateTempPassword() {
    return crypto.randomBytes(8).toString("hex");
}

async function getUserWithRelations(userId) {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password_hash"] },
        include: [
            {
                model: Role,
                as: "role",
                attributes: ["id", "name"],
            },
            {
                model: Department,
                as: "department",
                attributes: ["id", "name"],
            },
        ],
    });

    return user ? user.toJSON() : null;
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
            return {
                type: "validation_error",
                message: "Email already registered"
            };
        }

        //DOB Validation
        const dob = new Date(body.dob);
        const today = new Date();

        if (dob > today) {
            set.status = 400;
            return {
                type: "validation_error",
                message: "Date of birth cannot be in the future",
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
                type: "validation_error",
                message: "User must be at least 18 years old",
            };
        }

        if (age > 100) {
            set.status = 400;
            return {
                type: "validation_error",
                message: "Please enter a valid date of birth",
            };
        }

        //ROLE & DEPARTMENT VALIDATIONS
        const role = await Role.findByPk(body.role_id);
        if (!role) {
            set.status = 400;
            return {
                type: "validation_error",
                message: "Invalid role selected"
            };
        }

        const department = await Department.findByPk(body.department_id);
        if (!department) {
            set.status = 400;
            return {
                type: "validation_error",
                message: "Invalid department selected"
            };
        }

        const password = generateTempPassword();
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

        return getUserWithRelations(user.id);
    } catch (error) {
        console.error("Error creating user:", error);
        set.status = 500;
        return {
            type: "server_error",
            message: "Could not create user",
            details: error.message,
        };
    }
}

export async function getAllUsers() {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password_hash"] },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["id", "name"],
                },
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"]
                }
            ],
            order: [["id", "ASC"]],
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);

        set.status = 500;
        return {
            type: "server_error",
            message: "Could not fetch users",
            details: error.message,
        };
    }
}

export async function getUser({ params }) {
    try {
        const user = await getUserWithRelations(params.id);
        if (!user) {
            return { error: "User not found." }
        }
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);

        set.status = 500;
        return {
            type: "server_error",
            message: "Could not fetch user",
            details: error.message,
        };

    }
}

export async function updateUser({ params, body, set }) {
    try {
        const userId = Number(params.id);
        if (!userId || Number.isNaN(userId)) {
            set.status = 400;
            return {
                type: "validation_error",
                error: "Invalid user ID"
            }
        }

        const user = await User.findByPk(userId);

        if (!user) {
            set.status = 404;
            return {
                type: "validation_error",
                error: "User not found"
            };
        }

        delete body.id;
        delete body.password_hash;
        delete body.created_at;
        delete body.updated_at;

        const requiredFields = ["first_name", "last_name", "email", "phone", "address"];

        for (const field of requiredFields) {
            if (field in body && body[field].trim() === "") {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: `${field} cannot be empty`
                };
            }
        }

        //Remove empty strings
        Object.keys(body).forEach(key => {
            if (body[key] === "") delete body[key];
        });


        //email -> lowercase
        if (body.email) {
            body.email = body.email.trim().toLowerCase();
        }

        // Email duplicate check only if email changed
        if (body.email && body.email !== user.email) {
            const existingUser = await User.findOne({
                where: { email: body.email },
            });

            if (existingUser) {
                set.status = 409;
                return {
                    type: "validation_error",
                    message: "Email already registered"
                };
            }
        }

        // DOB validation only if DOB was sent
        if (body.dob) {
            const dob = new Date(body.dob);
            const today = new Date();

            if (Number.isNaN(dob.getTime())) {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: "Invalid date of birth"
                };
            }

            if (dob > today) {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: "Date of birth cannot be in the future"
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
                    type: "validation_error",
                    message: "User must be at least 18 years old"
                };
            }

            if (age > 100) {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: "Please enter a valid date of birth"
                };
            }
        }

        // Role validation only if role_id was sent
        if (body.role_id) {
            const role = await Role.findByPk(body.role_id);

            if (!role) {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: "Invalid role selected"
                };
            }
        }

        // Department validation only if department_id was sent
        if (body.department_id) {
            const department = await Department.findByPk(body.department_id);

            if (!department) {
                set.status = 400;
                return {
                    type: "validation_error",
                    message: "Invalid department selected"
                };
            }
        }

        if (body.password) {
            body.password_hash = await bcrypt.hash(body.password, 10)
            delete body.password;
        }

        const payload = {
            ...body,
            first_name: body.first_name ? body.first_name.trim() : user.first_name,
            middle_name: "middle_name" in body ? body.middle_name?.trim() || null : user.middle_name,
            last_name: body.last_name ? body.last_name.trim() : user.last_name,
            email: body.email ? body.email.trim().toLowerCase() : user.email,
            address: body.address ? body.address.trim() : user.address,
            emergency_contact: "emergency_contact" in body
                ? body.emergency_contact?.trim() || null
                : user.emergency_contact,
            emergency_phone: "emergency_phone" in body
                ? body.emergency_phone?.trim() || null
                : user.emergency_phone,
            role_id: body.role_id ? Number(body.role_id) : user.role_id,
            department_id: body.department_id
                ? Number(body.department_id)
                : user.department_id,
            is_active: typeof body.is_active === "boolean" ? body.is_active : user.is_active,
        };

        await user.update(payload);
        return getUserWithRelations(user.id);
    } catch (error) {
        console.error("Error updating user:", error);

        set.status = 500;
        return {
            type: "server_error",
            message: "Could not update user",
            details: error.message,
        };
    }
}

export async function deleteUser({ params, set }) {
    // ONCE AUTH ADDED ADD VALIDATION USER CAN DELETE OWN ACCOUNT OR ADMIN ACCOUNTS.
    try {
        const userId = Number(params.id);

        if (!userId || Number.isNaN(userId)) {
            set.status = 400;
            return {
                type: "validation_error",
                message: "Invalid user ID"
            }
        }

        const user = await User.findByPk(userId);

        if (!user) {
            set.status = 404;
            return {
                type: "not_found",
                message: "User not found,"
            }
        }

        const existingApplications = await Application.findOne({
            where: { user_id: userId }
        })

        if (existingApplications) {
            set.status = 409;
            return {
                type: "FK_constraint_error",
                message: "Cannot delete user because they have existing applications",
            }
        }

        await user.destroy();

        return {
            type: "success",
            message: "User deleted successfully",
            id: userId
        }
    } catch (error) {
        const backendError = error.response?.data;

        const message =
            backendError?.message ||
            backendError?.error ||
            "Failed to delete user.";

        setDeleteErrorMessage(message);
        handleCloseDeleteModal();
        handleOpenDeleteFailedModal();

        set.status = 500
        return {
            type: "conflict",
            message: "Cannot delete user because they have existing applications."
        }
    }
}
