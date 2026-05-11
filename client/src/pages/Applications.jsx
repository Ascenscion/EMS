import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getApplications, updateApplicationStatus } from '../../../client/src/services/applicationService.js';
import ReTable from '../components/ReTable.jsx';
const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        {
            header: "Applicant",
            render: (row) =>
                `${row.user?.first_name || ""} ${row.user?.last_name || ""}`,
        },
        {
            header: "Email",
            render: (row) => row.user?.email || "No email"
        },
        {
            header: "Event",
            render: (row) => row.event?.name || "No event"
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Applied At",
            render: (row) => new Date(row.applied_at).toLocaleDateString(),
        },
        {
            header: "Reviewed At",
            render: (row) =>
                row.reviewed_at
                    ? new Date(row.reviewed_at).toLocaleDateString()
                    : "Not reviewed",
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        disabled={row.status !== "pending"}
                        onClick={() => handleUpdateStatus(row.id, "approved")}
                        className="px-3 py-1 text-sm bg-green-700 text-white rounded-md disabled:bg-zinc-300"
                    >
                        Approve
                    </button>

                    <button
                        disabled={row.status !== "pending"}
                        onClick={() => handleUpdateStatus(row.id, "rejected")}
                        className="px-3 py-1 text-sm bg-red-700 text-white rounded-md disabled:bg-zinc-300"
                    >
                        Reject
                    </button>
                </div>
            ),
        },
    ]

    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Applications</h1>

            <ReTable columns={columns} data={applications} />
        </div>
    );
};



export default Applications