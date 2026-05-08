import React, { useEffect, useState } from 'react'

import ReTable from '../components/ReTable'
import { getActiveEvents } from '../services/eventService'


const StaffEvents = () => {
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    //const [locations, setLocations] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getActiveEvents()
                setEvents(data)
                console.log("Fetched Events: ", data);
                console.log("First Location:", data[0]?.Location?.name);
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
                    {/* {console.log("ROW", row)} */}
                    <button
                        onClick={() => handleOpenEditEventModal(row)}
                        className='px-3 py-1 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-800'>
                        Apply
                    </button>
                    <button
                        onClick={() => handleOpenDeleteEventModal(row)}
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
            {/* <EventModal
                isOpen={isEventModalOpen}
                onClose={handleCloseCreateNewEventModal}
                onSubmit={handleSaveEvent}
                event={selectedEvent}
            >
            </EventModal> */}
        </div>
    )
}

export default StaffEvents