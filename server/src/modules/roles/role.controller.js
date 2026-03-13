import db from "../../models/index.js"

const { Role } = db;

export async function createRole({ body }) {
    const role = await Role.create(body);
    return role;
}

export async function getAllRoles() {
    const roles = await Role.findAll();
    return roles;
}

export async function getRole({ params }) {
    const role = await Role.findByPk(params.id);
    if (!role) {
        return { error: "No role found" }
    }
    return role;
}

export async function updateRole({ params, body }) {
    const role = await Role.findByPk(params.id);
    if (!role) {
        return { error: "No role found" }
    }
    await role.update(body)
    return role;
}

export async function deleteRole({ params }) {
    const deleted = await Role.destroy({
        where: { id: params.id }
    })
    return deleted;
}