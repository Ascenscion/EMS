import React, { useEffect, useState } from 'react'
import ReTable from '../components/ReTable.jsx';
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService.js';
import AddButton from '../components/AddButton.jsx';
import AddUserModal from '../components/AddUserModal.jsx';
import Modal from '../components/Modal.jsx';

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isUserCreatedSuccesfullyModalOpen, setIsUserCreatedSuccesfullyModalOpen] = useState(false);
    const [isUserUpdatedSuccesfullyModalOpen, setIsUserUpdatedSuccesfullyModalOpen] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    const [openDeleteFailedModal, setOpenDeleteFailedModal] = useState(false);

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
                < div className='flex gap-2' >
                    <button
                        onClick={() => { handleOpenEditModal(row) }}
                        className='px-3 py-1 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-800'>
                        Edit
                    </button>

                    <button
                        onClick={() => handleOpenDeleteModal(row)}
                        className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                        Delete
                    </button>
                </div >
            )
        }
    ]

    const handleOpenAddModal = () => {
        setSelectedUser(null)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false)
    }

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user)
        //deleteTitle = `Are you sure you want to delete ${user}?`
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const handleOpenConfirmationModal = () => {
        setIsConfirmationModalOpen(true)
    }

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false)
    }

    const handleCloseUserCreatedModal = () => {
        setIsUserCreatedSuccesfullyModalOpen(false)
    }

    const handleOpenUserCreatedModal = () => {
        setIsUserCreatedSuccesfullyModalOpen(true)
    }

    const handleOpenUpdatedUserConfirmationModal = () => {
        setIsUserUpdatedSuccesfullyModalOpen(true)
    }

    const handleCloseUpdatedUserConfirmationModal = () => {
        setIsUserUpdatedSuccesfullyModalOpen(false)
    }

    const handleOpenDeleteFailedModal = () => {
        setOpenDeleteFailedModal(true)
    }

    const handleCloseDeleteFailedModal = () => {
        setOpenDeleteFailedModal(false)
        setDeleteErrorMessage("");
    }
    const handleSaveUser = async (formData, user) => {
        console.log("User Data: ", formData, user);
        try {
            const payload = {
                ...formData,
                department_id: Number(formData.department_id),
                role_id: Number(formData.role_id)
            }
            if (user) {
                delete payload.password;

                const updatedUser = await updateUser(user.id, payload);
                setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
                handleCloseModal();
                handleOpenUpdatedUserConfirmationModal();
            } else {
                const newUser = await createUser(payload);
                console.log("Created user response:", newUser);
                setUsers(prev => [
                    ...prev,
                    newUser
                ])
                handleCloseModal();
                handleOpenUserCreatedModal();
            }

        } catch (error) {
            console.error("Error creating user: ", error)
            console.error("Backend response: ", error.response?.data)
        }
    }

    const handleDelete = async (user) => {
        console.log("DELETE BUTTON CLICKED", user);
        try {
            const result = await deleteUser(user.id);
            console.log("Delete success:", result);
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            handleCloseDeleteModal();
            handleOpenConfirmationModal();
        } catch (error) {
            const backendError = error.response?.data;

            const message =
                backendError?.message ||
                backendError ||
                "Failed to delete user.";

            setDeleteErrorMessage(message);
            handleCloseDeleteModal()
            handleOpenDeleteFailedModal();
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end'>
                <AddButton
                    variant='primary'
                    onClick={handleOpenAddModal}>
                    + Add User
                </AddButton>
            </div>
            <ReTable
                columns={userColumns}
                data={users}
            ></ReTable>
            <AddUserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveUser}
                user={selectedUser}
            />
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Warning..."
                user={selectedUser}>
                <>
                    <div>
                        <p>Are you sure you want to delete this user ?</p>
                        <div className='flex p-4 gap-2 justify-end'>
                            <button
                                onClick={handleCloseDeleteModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(selectedUser)}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'>
                                Confirm
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
                title={"Success !"}
                user={selectedUser}
            >
                <>
                    <div className='flex flex-col'>
                        <p>User has been deleted.</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseConfirmationModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            >
                                Bye Felicia.
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isUserCreatedSuccesfullyModalOpen}
                title={"Success!"}
                onClose={handleCloseUserCreatedModal}
            >
                <>
                    <p>User Created Succesfully </p>
                    <div className='flex justify-end'>
                        <button
                            onClick={handleCloseUserCreatedModal}
                            className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                        >
                            Confirm</button>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isUserUpdatedSuccesfullyModalOpen}
                title={"Success!"}
                onClose={handleCloseUpdatedUserConfirmationModal}
            >
                <>
                    <p>User Updated Succesfully!</p>
                    <div className='flex justify-end'>
                        <button
                            onClick={handleCloseUpdatedUserConfirmationModal}
                            className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                        >
                            Confirm
                        </button>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={openDeleteFailedModal}
                onClose={handleCloseDeleteFailedModal}
                title="Cannot delete user">
                <>
                    <p>{deleteErrorMessage}</p>
                    <div className='flex justify-end mt-4'>
                        <button
                            onClick={handleCloseDeleteFailedModal}
                            className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                        >
                            Okay
                        </button>
                    </div>
                </>
            </Modal>
        </div >
    )
}

export default Users