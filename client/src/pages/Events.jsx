import React, { useEffect, useState } from 'react'
import AddButton from '../components/AddButton'
import ReTable from '../components/ReTable'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService'
import Modal from '../components/Modal'
import EventModal from '../components/EventModal'
import { getErrorMessage } from '../utils/getErrorMessage'

const Events = () => {
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
    const [isEventCreatedSuccesModalOpen, setIsEventCreatedSuccessModalOpen] = useState(false)
    const [isEventUpdatedSucccesModalOpen, setIsUpdatedSuccessModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [saveErrorMessage, setSaveErrorMessage] = useState("")
    const [isSaveErrorModalOpen, setIsSaveErrorModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents()
                setEvents(data)
            } catch (error) {
                setSaveErrorMessage(getErrorMessage(error, "Failed to load events."))
                handleOpenSaveErrorModal()
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const handleOpenCreateNewEventModal = () => {
        setSelectedEvent(null)
        setIsEventModalOpen(true)
    }

    const handleCloseCreateNewEventModal = () => {
        setSelectedEvent(null)
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

    const handleOpenDeleteConfirmationModal = () => {
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

    const handleOpenSaveErrorModal = () => {
        setIsSaveErrorModalOpen(true)
    }

    const handleCloseSaveErrorModal = () => {
        setSaveErrorMessage("")
        setIsSaveErrorModalOpen(false)
    }

    const handleSaveEvent = async (formData, event) => {
        const user = JSON.parse(localStorage.getItem("user"))
        const payload = {
            ...formData,
            name: formData.name?.trim(),
            description: formData.description?.trim(),
            location_name: formData.location_name?.trim(),
            address_line_1: formData.address_line_1?.trim(),
            address_line_2: formData.address_line_2?.trim() || undefined,
            city: formData.city?.trim(),
            state: formData.state?.trim(),
            zip_code: formData.zip_code?.trim(),
            max_users: Number(formData.max_users),
            created_by: user?.id || 1,
            status: "active"
        }
        try {
            setIsSaving(true)
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
            const message = getErrorMessage(error, "Failed to save/update event.")
            setSaveErrorMessage(message)
            handleOpenSaveErrorModal()
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteEvent = async (event) => {
        if (!event || !event.id) {
            return;
        }

        try {
            setIsDeleting(true)
            await deleteEvent(event.id);
            setEvents((prev) => prev.filter((u) => u.id !== event.id));
            handleCloseDeleteEventModal();
            handleOpenDeleteConfirmationModal(true)
        } catch (error) {
            const message = getErrorMessage(error, "Failed to delete event.")
            handleCloseDeleteEventModal();
            setSaveErrorMessage(message)
            handleOpenSaveErrorModal()
        } finally {
            setIsDeleting(false)
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

    const filteredEvents = events.filter((event) => {
        const name = event.name?.toLowerCase() || "";
        const status = event.status?.toLowerCase() || "";
        const location = event.Location?.name?.toLowerCase() || "";
        const city = event.Location?.city?.toLowerCase() || "";

        return (
            name.includes(searchTerm.toLowerCase()) ||
            status.includes(searchTerm.toLowerCase()) ||
            location.includes(searchTerm.toLowerCase()) ||
            city.includes(searchTerm.toLowerCase())
        );
    });

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className='flex flex-col'>
            <div className='p-2 flex justify-end gap-2'>
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 px-3 py-2 border border-zinc-300 rounded-md text-sm"
                />
                <AddButton
                    variant='primary'
                    onClick={handleOpenCreateNewEventModal}>
                    + New Event
                </AddButton>
            </div>
            {filteredEvents.length === 0 ? (
                <p className="text-sm text-zinc-500">No events match your search.</p>
            ) : (
                <ReTable
                    columns={eventColumns}
                    data={filteredEvents}>
                </ReTable>
            )}
            <EventModal
                isOpen={isEventModalOpen}
                onClose={handleCloseCreateNewEventModal}
                onSubmit={handleSaveEvent}
                event={selectedEvent}
                isSaving={isSaving}
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
                                disabled={isDeleting}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'>
                                {isDeleting ? "Deleting..." : "Confirm"}
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
            <Modal
                isOpen={isSaveErrorModalOpen}
                onClose={handleCloseSaveErrorModal}
                title={"Could not save event"}
            >
                <>
                    <div className='flex flex-col gap-4'>
                        <p>{saveErrorMessage}</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseSaveErrorModal}
                                className='px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

export default Events
