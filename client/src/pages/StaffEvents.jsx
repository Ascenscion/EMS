import React, { useEffect, useState } from 'react'

import ReTable from '../components/ReTable'
import { getActiveEvents } from '../services/eventService'
import Modal from '../components/Modal'
import AddButton from '../components/AddButton'
import { createApplication, getApplicationbyUser } from '../services/applicationService'


const StaffEvents = () => {
    const [loading, setLoading] = useState(true)
    const [isApplying, setIsApplying] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [events, setEvents] = useState([])
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [applications, setApplications] = useState([])

    const user = JSON.parse(localStorage.getItem("user"))
    const userId = Number(user?.id)

    const handleOpenApplyModal = (event) => {
        setErrorMessage("")
        setSelectedEvent(event)
        setIsApplyModalOpen(true)
    }

    const handleCloseApplyModal = () => {
        setIsApplyModalOpen(false)
    }

    const handleApply = async () => {
        if (!selectedEvent || !userId) {
            setErrorMessage("You must be signed in to apply to an event.")
            return;
        }

        try {
            setIsApplying(true)
            setErrorMessage("")
            const payload = {
                event_id: selectedEvent.id,
                user_id: userId,
                status: "pending"
            }

            await createApplication(payload)
            const updatedApplications = await getApplicationbyUser(userId);
            setApplications(updatedApplications)
            handleCloseApplyModal()
            handleOpenConfirmationModal()
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Could not submit your request."
            )
        } finally {
            setIsApplying(false)
        }
    }

    const handleOpenConfirmationModal = () => {
        setIsConfirmationModalOpen(true)
    }

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false)
    }

    const hasApplied = (eventId) => {
        return applications.some((app) =>
            Number(app.user_id) === userId &&
            app.event_id === eventId
        );
    };

    useEffect(() => {
        const fetchEvents = async () => {
            if (!userId) {
                setErrorMessage("You must be signed in to view available events.")
                setLoading(false)
                return;
            }

            try {
                setErrorMessage("")
                const data = await getActiveEvents()
                setEvents(data)
                const userApplications = await getApplicationbyUser(userId)
                setApplications(userApplications)
            } catch (error) {
                setErrorMessage(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Could not load active events."
                )
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [userId])

    const eventColumns = [
        { header: "Name", accessor: "name" },
        {
            header: "Venue",
            render: (row) => row.Location?.name || "No Venue"
        },
        {
            header: "City",
            render: (row) => row.Location?.city || "No City"
        },
        { header: "Start Date", accessor: "start_date" },
        { header: "End Date", accessor: "end_date" },
        {
            header: "Actions",
            render: (row) => {
                const applied = hasApplied(row.id)
                return (
                    <div className='flex gap-2'>
                    <button
                        disabled={applied}
                        onClick={() => handleOpenApplyModal(row)}
                        className={`px-3 py-1 text-sm rounded-md
        ${applied
                                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                                : "bg-zinc-900 text-white hover:bg-zinc-800"
                            }`}
                    >
                        {applied ? "Applied" : "Apply"}

                    </button>
                    <button
                        //onClick={}
                        className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                        Info
                    </button>
                </div>
                )
            }
        }
    ]

    if (loading) {
        return <p>Loading active events...</p>
    }

    return (
        <div className='flex flex-col gap-3'>
            {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                </p>
            )}

            {events.length === 0 ? (
                <p className="text-sm text-zinc-500">No active events are available right now.</p>
            ) : (
                <ReTable
                    columns={eventColumns}
                    data={events}>
                </ReTable>
            )}
            <Modal
                isOpen={isApplyModalOpen}
                onClose={handleCloseApplyModal}
                title="Request"
            >
                <>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <p>
                                Are you sure you want to apply to{" "}
                                <span className="font-semibold">{selectedEvent?.name}</span>?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <AddButton
                                type='button'
                                variant='secondary'
                                onClick={handleCloseApplyModal}
                                disabled={isApplying}>
                                Cancel
                            </AddButton>
                            <AddButton
                                type='button'
                                variant='primary'
                                onClick={handleApply}
                                disabled={isApplying}>
                                {isApplying ? "Submitting..." : "Confirm"}
                            </AddButton>
                        </div>
                    </div>

                </>
            </Modal>
            <Modal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
                title="Confirmed.">
                <>
                    <div className='flex flex-col'>
                        <p>Request sent !</p>
                        <div className="flex justify-end gap-2">
                            <AddButton
                                type='button'
                                variant='primary'
                                onClick={handleCloseConfirmationModal}>
                                Confirm
                            </AddButton>
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

export default StaffEvents
