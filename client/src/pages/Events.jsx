import React, { useEffect, useState } from 'react'
import AddButton from '../components/AddButton'
import ReTable from '../components/ReTable'
import { createEvent, getEvents, updateEvent } from '../services/eventService'
import Modal from '../components/Modal'
import EventModal from '../components/EventModal'

const Events = () => {
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)

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
                //handleOpenUpdatedEventConfirmationModal();
            } else {
                const newEvent = await createEvent(payload);
                setEvents((prev) => [...prev, newEvent]);
            }
            handleCloseCreateNewEventModal();
        } catch (error) {
            console.error("Error saving event: ", error)
            console.error("Backend Response: ", error.response?.data)
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


        </div>
    )
}

export default Events