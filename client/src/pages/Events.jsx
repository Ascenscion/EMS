import React, { useEffect, useState } from 'react'
import AddButton from '../components/AddButton'
import ReTable from '../components/ReTable'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService'
import Modal from '../components/Modal'
import EventModal from '../components/EventModal'

const Events = () => {
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
    const [isEventCreatedSuccesModalOpen, setIsEventCreatedSuccessModalOpen] = useState(false)
    const [isEventUpdatedSucccesModalOpen, setIsUpdatedSuccessModalOpen] = useState(false)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents()
                setEvents(data)
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

    const handleOpenCreateNewEventModal = () => {
        setSelectedEvent(null)
        setIsEventModalOpen(true)
    }

    const handleCloseCreateNewEventModal = () => {
        setIsEventModalOpen(false)
    }

    const handleOpenEditEventModal = (event) => {
        setSelectedEvent(event)
        setIsEventModalOpen(true)
    }

    const handleOpenDeleteEventModal = (event) => {
        setSelectedEvent(event)
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteEventModal = () => {
        setIsDeleteModalOpen(false)
    }

    const handleOpenDeleteConfirmationModal = (event) => {
        setIsDeleteConfirmationModalOpen(true)
    }

    const handleCloseDeleteConfirmationModal = () => {
        setIsDeleteConfirmationModalOpen(false)
    }

    const handleOpenEventCreatedModal = () => {
        setIsEventCreatedSuccessModalOpen(true)
    }

    const handleCloseEventCreatedModal = () => {
        setIsEventCreatedSuccessModalOpen(false)
    }

    const handleOpenEventUpdatedModal = () => {
        setIsUpdatedSuccessModalOpen(true)
    }

    const handleCloseEventUpdatedModal = () => {
        setIsUpdatedSuccessModalOpen(false)
    }

    const handleSaveEvent = async (formData, event) => {
        const payload = {
            ...formData,
            max_users: Number(formData.max_users),
            created_by: 1,
            status: "active"
        }
        try {
            if (event) {
                const updatedEvent = await updateEvent(event.id, payload);
                setEvents((prev) =>
                    prev.map((e) => e.id === event.id ? updatedEvent : e)
                )
                handleOpenEventUpdatedModal();
            } else {
                const newEvent = await createEvent(payload);
                setEvents((prev) => [...prev, newEvent]);
                handleOpenEventCreatedModal();
            }
            handleCloseCreateNewEventModal();
        } catch (error) {
            console.error("Error saving event: ", error)
            console.error("Backend Response: ", error.response?.data)
        }
    }

    const handleDeleteEvent = async (event) => {
        try {
            const result = await deleteEvent(event.id);
            setEvents((prev) => prev.filter((u) => u.id !== event.id));
            handleCloseDeleteEventModal();
            handleOpenDeleteConfirmationModal(true)
        } catch (error) {
            const backendError = error.response?.data;
            const message =
                backendError?.message ||
                backendError ||
                "Failed to delete event";
            handleCloseDeleteEventModal();
        }
    }

    const eventColumns = [
        { header: "Name", accessor: "name" },
        { header: "Location ID", accessor: "location_id" },
        { header: "Status", accessor: "status" },
        { header: "Start Date", accessor: "start_date" },
        { header: "End Date", accessor: "end_date" },
        { header: "Created by", accessor: "created_by" },

        {
            header: "Actions",
            render: (row) => (

                <div className='flex gap-2'>
                    {/* {console.log("ROW", row)} */}
                    <button
                        onClick={() => handleOpenEditEventModal(row)}
                        className='px-3 py-1 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-800'>
                        Edit
                    </button>
                    <button
                        onClick={() => handleOpenDeleteEventModal(row)}
                        className='px-3 py-1 text-sm border border-zinc-300 rounded-md hover:bg-zinc-100'>
                        Delete
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end'>
                <AddButton
                    variant='primary'
                    onClick={handleOpenCreateNewEventModal}>
                    + New Event
                </AddButton>
            </div>
            <ReTable
                columns={eventColumns}
                data={events}>
            </ReTable>
            <EventModal
                isOpen={isEventModalOpen}
                onClose={handleCloseCreateNewEventModal}
                onSubmit={handleSaveEvent}
                event={selectedEvent}
            >
            </EventModal>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteEventModal}
                title="Warning..."
                event={selectedEvent}>
                <>
                    <div>
                        <p>Are you sure you want to delete this event ?</p>
                        <div className='flex p-4 gap-2 justify-end'>
                            <button
                                onClick={handleCloseDeleteEventModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteEvent(selectedEvent)}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'>
                                Confirm
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isDeleteConfirmationModalOpen}
                onClose={handleCloseDeleteConfirmationModal}
                title={"Success !"}
                event={selectedEvent}
            >
                <>
                    <div className='flex flex-col'>
                        <p>Event has been deleted.</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseDeleteConfirmationModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            >
                                Bye Felicia.
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isEventCreatedSuccesModalOpen}
                onClose={handleCloseEventCreatedModal}
                title={"Success !"}
                event={selectedEvent}
            >
                <>
                    <div className='flex flex-col'>
                        <p>Event has been Created Successfully!.</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseEventCreatedModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            >
                                Success.
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
            <Modal
                isOpen={isEventUpdatedSucccesModalOpen}
                onClose={handleCloseEventUpdatedModal}
                title={"Success !"}
                event={selectedEvent}
            >
                <>
                    <div className='flex flex-col'>
                        <p>Event has been Updated Successfully!.</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseEventUpdatedModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            >
                                Success.
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

export default Events