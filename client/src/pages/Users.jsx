import React, { useEffect, useState } from 'react'
import ReTable from '../components/ReTable.jsx';
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService.js';
import AddButton from '../components/AddButton.jsx';
import UserModal from '../components/UserModal.jsx';
import Modal from '../components/Modal.jsx';
import { getRoles } from "../services/roleService"
import { getDepartments } from '../services/departmentService.js';
import { getErrorMessage } from "../utils/getErrorMessage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    const [roles, setRoles] = useState([])
    const [departments, setDepartments] = useState([])
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const results = await Promise.allSettled([
                    getRoles(),
                    getDepartments(),
                    getUsers(),
                ]);

                const [rolesResult, departmentsResult, usersResult] = results;

                if (rolesResult.status === "fulfilled") {
                    setRoles(rolesResult.value);
                } else {
                    console.error(
                        "Roles:",
                        getErrorMessage(
                            rolesResult.reason,
                            "Failed to fetch roles."
                        )
                    );
                }

                if (departmentsResult.status === "fulfilled") {
                    setDepartments(departmentsResult.value);
                } else {
                    console.error(
                        "Departments:",
                        getErrorMessage(
                            departmentsResult.reason,
                            "Failed to fetch departments."
                        )
                    );
                }

                if (usersResult.status === "fulfilled") {
                    setUsers(usersResult.value);
                } else {
                    console.error(
                        "Users:",
                        getErrorMessage(
                            usersResult.reason,
                            "Failed to fetch users."
                        )
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    const userColumns = [
        { header: "First Name", accessor: "first_name" },
        { header: "Last Name", accessor: "last_name" },
        { header: "Email", accessor: "email" },
        { header: "Phone", accessor: "phone" },
        {
            header: "Department",
            render: (row) => row.department?.name || "No department",
        },
        {
            header: "Role",
            render: (row) => row.role?.name || "No role",
        },
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
                        disabled={isDeleting}
                        onClick={() => handleOpenDeleteModal(row)}
                        className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div >
            )
        }
    ]

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = user.email?.toLowerCase() || "";

        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
        );
    });

    const generatePDF = () => {
        const doc = new jsPDF();

        const tableColumn = [
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Department",
            "Role",
            "Clock In",
            "Clock Out"
        ];

        const tableRows = filteredUsers.map((user) => [
            user.first_name,
            user.last_name,
            user.email,
            user.phone,
            user.department?.name || "No department",
            user.role?.name || "No role"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows
        })

        doc.save();
    }

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
        setSelectedUser(null)
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
            setIsSaving(true)
            const payload = {
                ...formData,
                department_id: Number(formData.department_id),
                role_id: Number(formData.role_id),
                emergency_contact: formData.emergency_contact?.trim() || undefined,
                emergency_phone: formData.emergency_phone?.trim() || undefined,
            }
            if (user) {
                delete payload.password;

                const updatedUser = await updateUser(user.id, payload);
                setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
                handleCloseModal();
                handleOpenUpdatedUserConfirmationModal();
            } else {
                console.log("FORM DATA:", formData)
                console.log("PAYLOAD:", payload)
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
            const message = getErrorMessage(error, "Failed to save/update user");
            console.log(message);
            throw error;
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (user) => {
        //AUTH: once implemented add validation so user cant delete himself.
        if (!user || !user.id) {
            return;
        }
        // UNCOMMENT WHEN AUTH IMPLEMENTED
        // if (loggedInUser.id === user.id) {
        //     setDeleteErrorMessage("You cannot delete own account.");
        //     handleOpenDeleteFailedModal();
        //     return;
        // }
        try {
            setIsDeleting(true);

            await deleteUser(user.id);
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            setSelectedUser(null);

            handleCloseDeleteModal();
            handleOpenConfirmationModal();
        } catch (error) {
            const backendError = error.response?.data;

            const message = getErrorMessage(error, "Failed to delete user.")
            console.log(message);
            setDeleteErrorMessage(message);
            handleCloseDeleteModal()
            handleOpenDeleteFailedModal();
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end gap-2'>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 px-3 py-2 border border-zinc-300 rounded-md text-sm"
                />
                <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                    Export PDF
                </button>
                <AddButton
                    variant='primary'
                    onClick={handleOpenAddModal}>
                    + Add User
                </AddButton>

            </div>
            {filteredUsers.length === 0 ? (
                <p className="text-sm text-zinc-500">No users match your search.</p>
            ) : (
                <ReTable columns={userColumns} data={filteredUsers} />
            )}
            <UserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveUser}
                user={selectedUser}
                roles={roles}
                departments={departments}
                isSaving={isSaving}
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
                                {isDeleting ? "Deleting..." : "Delete"}
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