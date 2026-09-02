import React, { useEffect, useState } from 'react'
import ReTable from '../components/ReTable.jsx';
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService.js';
import AddButton from '../components/AddButton.jsx';
import UserModal from '../components/UserModal.jsx';
import Modal from '../components/Modal.jsx';
import UserActionsDropdown from '../components/UserActionsDropdown.jsx';
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
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatusUser, setSelectedStatusUser] = useState(null);
    const [statusAction, setStatusAction] = useState(null);
    const [statusUpdatingUserId, setStatusUpdatingUserId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadErrorMessage, setLoadErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("active");

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setLoadErrorMessage("");

                const results = await Promise.allSettled([
                    getRoles(),
                    getDepartments(),
                    getUsers(),
                ]);

                const [rolesResult, departmentsResult, usersResult] = results;

                if (rolesResult.status === "fulfilled") {
                    setRoles(rolesResult.value);
                } else {
                    setLoadErrorMessage(getErrorMessage(rolesResult.reason, "Failed to fetch roles."));
                }

                if (departmentsResult.status === "fulfilled") {
                    setDepartments(departmentsResult.value);
                } else {
                    setLoadErrorMessage(getErrorMessage(departmentsResult.reason, "Failed to fetch departments."));
                }

                if (usersResult.status === "fulfilled") {
                    setUsers(usersResult.value);
                } else {
                    setLoadErrorMessage(getErrorMessage(usersResult.reason, "Failed to fetch users."));
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
                <UserActionsDropdown
                    user={row}
                    isDeleting={isDeleting}
                    isStatusUpdating={statusUpdatingUserId === row.id}
                    onEdit={handleOpenEditModal}
                    onArchive={handleOpenArchiveModal}
                    onActivate={handleOpenActivateModal}
                    onDelete={handleOpenDeleteModal}
                />
            )
        }
    ]

    const tabs = [
        { label: "Active", value: "active" },
        { label: "Archive", value: "archive" },
    ];

    const isActiveUser = (user) => user.is_active !== false;

    const getCountByStatus = (status) => users.filter((user) => (
        status === "active" ? isActiveUser(user) : !isActiveUser(user)
    )).length;

    const usersByStatus = users.filter((user) => (
        activeTab === "active" ? isActiveUser(user) : !isActiveUser(user)
    ));

    const filteredUsers = usersByStatus.filter((user) => {
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
            "Role"
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

        doc.save("users-report.pdf");
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

    const handleOpenArchiveModal = (user) => {
        setSelectedStatusUser(user);
        setStatusAction("archive");
        setIsStatusModalOpen(true);
    }

    const handleOpenActivateModal = (user) => {
        setSelectedStatusUser(user);
        setStatusAction("activate");
        setIsStatusModalOpen(true);
    }

    const handleCloseStatusModal = () => {
        setSelectedStatusUser(null);
        setStatusAction(null);
        setIsStatusModalOpen(false);
    }

    const handleSaveUser = async (formData, user) => {
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
                const newUser = await createUser(payload);
                setUsers(prev => [
                    ...prev,
                    newUser
                ])
                handleCloseModal();
                handleOpenUserCreatedModal();
            }

        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdateUserStatus = async () => {
        if (!selectedStatusUser || !selectedStatusUser.id || !statusAction) {
            return;
        }

        const isActivating = statusAction === "activate";

        try {
            setStatusUpdatingUserId(selectedStatusUser.id);
            const updatedUser = await updateUser(selectedStatusUser.id, {
                is_active: isActivating,
            });

            setUsers((prev) => prev.map((u) => (
                u.id === selectedStatusUser.id ? updatedUser : u
            )));
            handleCloseStatusModal();
        } catch (error) {
            setDeleteErrorMessage(
                getErrorMessage(
                    error,
                    isActivating ? "Failed to activate user." : "Failed to archive user."
                )
            );
            handleCloseStatusModal();
            handleOpenDeleteFailedModal();
        } finally {
            setStatusUpdatingUserId(null);
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
            const message = getErrorMessage(error, "Failed to delete user.")
            setDeleteErrorMessage(message);
            handleCloseDeleteModal()
            handleOpenDeleteFailedModal();
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='p-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div className="flex gap-2 border-b border-zinc-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition
                                ${activeTab === tab.value
                                    ? "border-zinc-900 text-zinc-900"
                                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                                }`}
                        >
                            {tab.label} ({getCountByStatus(tab.value)})
                        </button>
                    ))}
                </div>

                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
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

            </div>
            {loadErrorMessage && (
                <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {loadErrorMessage}
                </p>
            )}
            {filteredUsers.length === 0 ? (
                <p className="text-sm text-zinc-500">
                    No {activeTab === "active" ? "active" : "archived"} users match your search.
                </p>
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
                isOpen={isStatusModalOpen}
                onClose={handleCloseStatusModal}
                title={statusAction === "activate" ? "Activate User" : "Archive User"}
            >
                <>
                    <div>
                        <p>
                            Are you sure you want to {statusAction === "activate" ? "activate" : "archive"}{" "}
                            {selectedStatusUser?.first_name} {selectedStatusUser?.last_name}?
                        </p>
                        <div className='flex p-4 gap-2 justify-end'>
                            <button
                                onClick={handleCloseStatusModal}
                                disabled={statusUpdatingUserId === selectedStatusUser?.id}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60'>
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUserStatus}
                                disabled={statusUpdatingUserId === selectedStatusUser?.id}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-60'>
                                {statusUpdatingUserId === selectedStatusUser?.id
                                    ? statusAction === "activate" ? "Activating..." : "Archiving..."
                                    : statusAction === "activate" ? "Activate" : "Archive"}
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={openDeleteFailedModal}
                onClose={handleCloseDeleteFailedModal}
                title="User action failed">
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
