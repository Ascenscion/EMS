import db from "../../models/index.js"

const { Assignment } = db;

export async function createAssignment({ body }) {
    const { status } = body;
    const assignment = await Assignment.create({ status })
    return assignment;
}

export async function getAllAssignments() {
    const assignments = await Assignment.findAll();
    return assignments;
}

export async function getAssignment({ params }) {
    const assignment = await Assignment.findByPk(params.id);
    if (!assignment) {
        return { error: "Assignment not found." }
    }
    return assignment;
}

export async function updateAssignment({ params, body }) {
    const assignment = await Assignment.findByPk(params.id);
    if (!assignment) {
        return { error: "Assignment not found" }
    }
    await assignment.update(body);
    return assignment;
}

export async function deleteAssignment({ params }) {
    const deleted = await Assignment.destroy({
        where: { id: params.id }
    })
    return deleted;
}
