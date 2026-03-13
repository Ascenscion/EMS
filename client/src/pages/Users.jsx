import React from 'react'
import ReTable from '../components/ReTable';
const userColumns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Department", accessor: "department_id" },
    { header: "Role", accessor: "role_id" }
]
const users = [
    {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        department_id: 1,
        role_id: 2
    },
    {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "555-987-6543",
        department_id: 2,
        role_id: 1
    },
    {
        first_name: "Michael",
        last_name: "Brown",
        email: "michael.brown@example.com",
        phone: "555-456-7890",
        department_id: 3,
        role_id: 3
    },
    {
        first_name: "Emily",
        last_name: "Davis",
        email: "emily.davis@example.com",
        phone: "555-321-0987",
        department_id: 1,
        role_id: 2
    },
    {
        first_name: "William",
        last_name: "Johnson",
        email: "william.johnson@example.com",
        phone: "555-654-3210",
        department_id: 2,
        role_id: 1
    }
];


const Users = () => {
    return (
        <ReTable
            columns={userColumns}
            data={users}
        ></ReTable>
    )
}

export default Users