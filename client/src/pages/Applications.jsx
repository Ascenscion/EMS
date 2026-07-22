import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getApplications, updateApplicationStatus } from '../services/applicationService.js';
import ReTable from '../components/ReTable.jsx';
import Modal from '../components/Modal.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("pending");

    const handleOpenConfirmModal = (application, status) => {
        setErrorMessage("");
        setSelectedApplication(application);
        setActionType(status);
        setIsConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSelectedApplication(null);
        setActionType(null);
    };

    const handleConfirmStatusUpdate = async () => {
        if (!selectedApplication || !actionType) return;

        const updatedApplication = await handleUpdateStatus(selectedApplication.id, actionType);
        if (!updatedApplication) return;

        setIsConfirmModalOpen(false);
        setSuccessMessage(
            `Application has been ${actionType === "approved" ? "approved" : "rejected"}.`
        )
        setIsSuccessModalOpen(true);
    };


    const getCountByStatus = (status) =>
        applications.filter((app) => app.status === status).length;

    const filteredApplications = applications.filter(
        (app) => app.status === activeTab
    );

    const tabs = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
    ];


    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setErrorMessage("");
                const data = await getApplications();
                setApplications(data);
            } catch (error) {
                setErrorMessage(getErrorMessage(error, "Could not load applications."));
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (applicationId, status) => {
        if (!user?.id) {
            setErrorMessage("You must be signed in to review applications.");
            return null;
        }

        try {
            setIsUpdating(true);
            setErrorMessage("");
            const updatedApplication = await updateApplicationStatus(applicationId, {
                status,
                reviewed_by_user_id: user.id,
            });

            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId
                        ? updatedApplication
                        : app
                )
            )
            return updatedApplication;
        } catch (error) {
            setErrorMessage(getErrorMessage(error, "Could not update application."));
            return null;
        } finally {
            setIsUpdating(false);
        }
    }


    const pendingColumns = [
        {
            header: "ID",
            render: (row) => row.user?.id || "No ID",
        },
        {
            header: "Applicant",
            render: (row) =>
                `${row.user?.first_name || ""} ${row.user?.last_name || ""}`,
        },
        {
            header: "Event",
            render: (row) => row.event?.name || "No event",
        },
        {
            header: "Applied At",
            render: (row) => new Date(row.applied_at).toLocaleDateString(),
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        disabled={isUpdating}
                        onClick={() => handleOpenConfirmModal(row, "approved")}
                        className="px-3 py-1 text-sm bg-green-700 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Approve
                    </button>

                    <button
                        disabled={isUpdating}
                        onClick={() => handleOpenConfirmModal(row, "rejected")}
                        className="px-3 py-1 text-sm bg-red-700 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Reject
                    </button>
                </div>
            ),
        },
    ];

    const reviewedColumns = [
        {
            header: "ID",
            render: (row) => row.user?.id || "No ID",
        },
        {
            header: "Applicant",
            render: (row) =>
                `${row.user?.first_name || ""} ${row.user?.last_name || ""}`,
        },
        {
            header: "Event",
            render: (row) => row.event?.name || "No event",
        },
        {
            header: "Reviewed At",
            render: (row) =>
                row.reviewed_at
                    ? new Date(row.reviewed_at).toLocaleDateString()
                    : "Not reviewed",
        },
        {
            header: "Reviewed By",
            render: (row) =>
                row.reviewer
                    ? `${row.reviewer.first_name} ${row.reviewer.last_name}`
                    : "Not reviewed"
        },
    ];

    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Applications</h1>

            {errorMessage && (
                <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                </p>
            )}

            <div className="flex gap-2 border-b border-zinc-200 mb-4">
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
            {filteredApplications.length === 0 ? (
                <p className="text-sm text-zinc-500">No {activeTab} applications.</p>
            ) : (
                <ReTable
                    columns={activeTab === "pending" ? pendingColumns : reviewedColumns}
                    data={filteredApplications}
                />
            )}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                title={actionType === "approved" ? "Approve Application" : "Reject Application"}
            >
                <div>
                    <p>
                        Are you sure you want to {actionType === "approved" ? "approve" : "reject"}{" "}
                        {selectedApplication?.user?.first_name} {selectedApplication?.user?.last_name}
                        {" "}for {selectedApplication?.event?.name}?
                    </p>

                    <div className="flex p-4 gap-2 justify-end">
                        <button
                            onClick={handleCloseConfirmModal}
                            disabled={isUpdating}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirmStatusUpdate}
                            disabled={isUpdating}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUpdating ? "Updating..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Success!"
            >
                <div className="flex flex-col gap-4">
                    <p>{successMessage}</p>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setIsSuccessModalOpen(false)
                                setSelectedApplication(null)
                                setActionType(null)
                                setSuccessMessage("")
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



export default Applications
