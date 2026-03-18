import React, { useEffect, useState } from 'react'
import ReTable from '../components/ReTable.jsx';
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService.js';
import AddButton from '../components/AddButton.jsx';
import AddUserModal from '../components/AddUserModal.jsx';

const Users = () => {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEdit = async (user) => {
        setSelectedUser(user);
        setOpen(true);
    }

    const handleDelete = async (user) => {
        try {
            await deleteUser(user.id)
            setUsers(prev => prev.filter(u => u.id !== user.id))
        } catch (error) {
            console.error("Error deleting user: ", error.response?.data);
        }
    }

    const handleCreateUser = async (data, user) => {
        console.log("User Data: ", data);

        try {
            if (user) {
                const updatedUser = await updateUser(user.id, data);
                setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
            } else {
                const newUser = await createUser(data);
                setUsers(prev => [
                    ...prev,
                    newUser
                ])
                setOpen(false)
            }
        } catch (error) {
            console.error("Error creating user: ", error)
        }
    }
    // try {
    //     const newUser = await createUser(data)
    //     console.log("Created user: ", newUser);
    //     setUsers(prev => [
    //         ...prev,
    //         newUser
    //     ])
    //     setOpen(false)


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
    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end border-2 border-green-500'>
                <AddButton onClick={() => { setSelectedUser(null); setOpen(true); }}>+ Add User</AddButton>
            </div>
            <AddUserModal isOpen={open} onClose={() => { setOpen(false); setSelectedUser(null); }} onSubmit={handleCreateUser} user={selectedUser} />
            <ReTable
                columns={userColumns}
                data={users}
            ></ReTable>
        </div >
    )
}

export default Users