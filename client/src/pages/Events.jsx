import React, { useEffect, useState } from 'react'
import AddButton from '../components/AddButton'
import ReTable from '../components/ReTable'
import { getEvents } from '../services/eventService'

const Events = () => {
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            console.log("THIS IS RUNNING");
            try {
                const data = await getEvents()
                setEvents(data)
                console.log("Event data: ", events[0]);
            } catch (error) {
                console.log("Error fetching events", error);
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const handleOpenCreateNewEventModal = () => {

    }

    const handleCloseCreateNewEventModal = () => {

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
                    {console.log("ROW", row)}
                    <button
                        //onClick={handleOpenEditEventModal(row)}
                        className='px-3 py-1 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-800'>
                        Edit
                    </button>
                    <button
                        //onClick={() => handleOpenDeleteEventModal(row)}
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
        </div>
    )
}

export default Events