import React, { useEffect, useState } from 'react'
import ReTable from '../components/ReTable.jsx';
import { getUsers, createUser } from '../services/userService.js';
import AddButton from '../components/AddButton.jsx';
import AddUserModal from '../components/AddUserModal.jsx';
const userColumns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Department", accessor: "department_id" },
    { header: "Role", accessor: "role_id" },
    {
        header: "Actions",
        render: (row) => (
            // console.log("ROW", row)
            // return (<span>test</span>)
            <div className='flex gap-2'>
                <button
                    onClick={() => handleEdit(row)}
                    className='px-3 py-1 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-800'>
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(row)}
                    className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                    Delete
                </button>
            </div>
        )
    }
]

const Users = () => {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const handleCreateUser = async (data) => {
        console.log("User Data: ", data);
        try {
            const newUser = await createUser(data)
            console.log("Created user: ", newUser);
            setUsers(prev => [
                ...prev,
                newUser
            ])
            setOpen(false)
        } catch (error) {
            console.error("Error creating user: ", error)
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers()
                setUsers(data)
            } catch (error) {
                console.log("Error fetching users: ", error);
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end border-2 border-green-500'>
                <AddButton onClick={() => { console.log("Button "), setOpen(true) }}>+ Add User</AddButton>
            </div>
            <AddUserModal isOpen={open} onClose={() => setOpen(false)} onSubmit={handleCreateUser} />
            <ReTable
                columns={userColumns}
                data={users}
            ></ReTable>
        </div >
    )
}

export default Users