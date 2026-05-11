import React, { useEffect, useState } from "react";
import ReTable from "../components/ReTable";
import { getApplicationbyUser } from "../services/applicationService";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const data = await getApplicationbyUser(user.id);
                setApplications(data);
            } catch (error) {
                console.log("Error fetching my applications:", error);
                console.log("Backend response:", error.response?.data);
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, []);

    const tabs = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
    ];

    const getCountByStatus = (status) =>
        applications.filter((app) => app.status === status).length;

    const filteredApplications = applications.filter(
        (app) => app.status === activeTab
    );

    const columns = [
        {
            header: "Event",
            render: (row) => row.event?.name || "No event",
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
            header: "Reviewed By",
            render: (row) =>
                row.reviewer
                    ? `${row.reviewer.first_name} ${row.reviewer.last_name}`
                    : "Not reviewed",
        },
    ];

    if (loading) return <p>Loading my applications...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">My Applications</h1>

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

            <ReTable columns={columns} data={filteredApplications} />
        </div>
    );
};

export default MyApplications;