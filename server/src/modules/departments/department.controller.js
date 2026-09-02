import db from "../../models/index.js"
const { Department } = db;

export async function createDepartment({ body }) {
    const { name } = body
    const department = await Department.create({
        name
    })
    return department
}

export async function getAllDepartments() {
    const departments = await Department.findAll();
    return departments
}

export async function getDepartment({ params }) {
    const department = await Department.findByPk(params.id);
    if (!department) {
        return { error: "Deparment not found" }
    }
    return department;
}

export async function updateDepartment({ params, body }) {
    const department = await Department.findByPk(params.id)
    if (!department) {
        return { error: "Department not found" }
    }
    await department.update(body);
    return department;
}

export async function deleteDepartment({ params }) {
    const deleted = await Department.destroy({
        where: { id: params.id }
    })
    return deleted;
}
