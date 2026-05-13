import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getApplications, updateApplicationStatus } from '../../../client/src/services/applicationService.js';
import ReTable from '../components/ReTable.jsx';
import Modal from '../components/Modal.jsx';
const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("pending");

    const handleOpenConfirmModal = (application, status) => {
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

        await handleUpdateStatus(selectedApplication.id, actionType);

        setIsConfirmModalOpen(false);
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
                const data = await getApplications();
                setApplications(data);
            } catch (error) {
                console.log("Error fetching applications: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            const updatedApplication = await updateApplicationStatus(applicationId, {
                status,
                reviewed_by_user_id: user.id,
            });

            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId
                        ? {
                            ...app,
                            status: updatedApplication.status,
                            reviewed_at: updatedApplication.reviewed_at,
                            reviewed_by_user_id: updatedApplication.reviewed_by_user_id,
                        }
                        : app
                )
            )
        } catch (error) {
            console.log("Error updating application: ", error);
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
                        onClick={() => handleOpenConfirmModal(row, "approved")}
                        className="px-3 py-1 text-sm bg-green-700 text-white rounded-md"
                    >
                        Approve
                    </button>

                    <button
                        onClick={() => handleOpenConfirmModal(row, "rejected")}
                        className="px-3 py-1 text-sm bg-red-700 text-white rounded-md"
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
            <ReTable
                columns={activeTab === "pending" ? pendingColumns : reviewedColumns}
                data={filteredApplications}
            />
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
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirmStatusUpdate}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800"
                        >
                            Confirm
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
                    <p>
                        Application has been {actionType === "approved" ? "approved" : "rejected"}.
                    </p>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
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