import React, { useEffect, useState } from 'react'

import ReTable from '../components/ReTable'
import { getActiveEvents } from '../services/eventService'
import Modal from '../components/Modal'
import AddButton from '../components/AddButton'
import { createApplication, getApplicationbyUser } from '../services/applicationService'


const StaffEvents = () => {
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [applications, setApplications] = useState([])

    const user = JSON.parse(localStorage.getItem("user"))

    const handleOpenApplyModal = (event) => {
        setSelectedEvent(event)
        setIsApplyModalOpen(true)
    }

    const handleCloseApplyModal = () => {
        setIsApplyModalOpen(false)
    }

    const handleApply = async () => {
        try {
            const payload = {
                event_id: selectedEvent.id,
                user_id: user.id,
                status: "pending"
            }

            await createApplication(payload)
            const updatedApplications = await getApplicationbyUser(user.id);
            setApplications(updatedApplications)
            handleCloseApplyModal()
            handleOpenConfirmationModal()
        } catch (error) {
            console.log("Error applying to event: ", error);
            console.log("Backend response: ", error.response?.data);
        }
    }

    const handleOpenConfirmationModal = () => {
        setIsConfirmationModalOpen(true)
    }

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false)
    }

    const hasApplied = (eventId) => {
        console.log("Checking event:", eventId);
        console.log("Applications:", applications);
        return applications.some((app) =>
            app.user_id === user.id &&
            app.event_id === eventId
        );
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getActiveEvents()
                setEvents(data)
                console.log("Fetched Events: ", data);
                console.log("First Location:", data[0]?.Location?.name);
                const userApplications = await getApplicationbyUser(user.id)
                console.log("Logged user:", user)
                console.log("User applications:", userApplications)
                console.log("Active events:", data)
                setApplications(userApplications)
            } catch (error) {
                console.log("Error fetching events", error);
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    useEffect(() => {
        console.log("Events state changed:", events)
        console.log("First event from state:", events[0])
    }, [events])

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
            render: (row) => (

                <div className='flex gap-2'>
                    <button
                        disabled={hasApplied(row.id)}
                        onClick={() => handleOpenApplyModal(row)}
                        className={`px-3 py-1 text-sm rounded-md
        ${hasApplied(row.id)
                                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                                : "bg-zinc-900 text-white hover:bg-zinc-800"
                            }`}
                    >
                        {hasApplied(row.id) ? "Applied" : "Apply"}

                    </button>
                    <button
                        //onClick={}
                        className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                        Info
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className='flex flex-col'>
            <ReTable
                columns={eventColumns}
                data={events}>
            </ReTable>
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
                                onClick={handleCloseApplyModal}>
                                Cancel
                            </AddButton>
                            <AddButton
                                type='button'
                                variant='primary'
                                onClick={handleApply}>
                                Confirm
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