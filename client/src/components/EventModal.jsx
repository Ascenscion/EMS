import React from 'react'
import Modal from './Modal'
import { useForm } from 'react-hook-form'
import InputWrap from './InputWrap'
import AddButton from './AddButton'
import TextAreaWrap from './TextAreaWrap'
import { useEffect } from 'react'

const EventModal = ({ isOpen, onClose, event, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            location_id: "",
            max_users: "",
            description: "",
            status: "",
            start_date: "",
            end_date: "",
            created_by: "",
        }
    })

    useEffect(() => {
        if (event) {
            reset({
                name: event.name || "",
                location_id: event.location_id || "",
                max_users: event.max_users || "",
                description: event.description || "",
                status: event.status || "",
                start_date: event.start_date?.slice(0, 10) || "",
                end_date: event.end_date?.slice(0, 10) || "",
                created_by: event.created_by || "",

                location_name: event.Location?.name || "",
                address_line_1: event.Location?.address_line_1 || "",
                address_line_2: event.Location?.address_line_2 || "",
                city: event.Location?.city || "",
                state: event.Location?.state || "",
                zip_code: event.Location?.zip_code || ""
            })
        } else {
            reset({
                name: "",
                location_id: "",
                max_users: "",
                description: "",
                status: "",
                start_date: "",
                end_date: "",
                created_by: "",

                location_name: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                zip_code: ""

            })
        }
    }, [event, isOpen, reset])

    const submitHandler = async (data) => {
        await onSubmit(data, event)
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={event ? "Edit Event" : "Create New Event"}
            >
                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className='flex flex-col gap-4'>
                    <div>
                        <InputWrap
                            placeHolder="Event name"
                            name="name"
                            register={register}
                            rules={{
                                required: "Event name is required.",
                            }}
                            error={errors.name} />
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                name="start_date"
                                type="date"
                                register={register} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                name="end_date"
                                type="date"
                                register={register} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                placeHolder="Staff #"
                                name="max_users"
                                type="number"
                                register={register}
                                rules={{ required: "Max users is required." }}
                                error={errors.max_users} />
                        </div>
                    </div>
                    <div>
                        <InputWrap
                            placeHolder="Location name"
                            name="location_name"
                            type="text"
                            register={register} />
                    </div>
                    <div>
                        <InputWrap
                            placeHolder="Address Line 1"
                            name="address_line_1"
                            type="text"
                            register={register} />
                    </div>
                    <div>
                        <InputWrap
                            placeHolder="Apr, suite, or Unit"
                            name="address_line_2"
                            type="text"
                            register={register} />
                    </div>
                    <div>
                        <InputWrap
                            placeHolder="City"
                            name="city"
                            type="text"
                            register={register} />
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                placeHolder="State"
                                name="state"
                                type="text"
                                register={register} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                placeHolder="Zip code"
                                name="zip_code"
                                type="text"
                                register={register} />
                        </div>
                    </div>
                    <div>
                        <TextAreaWrap
                            placeHolder="Description"
                            name="description"
                            register={register}
                            rows={10}
                            cols={30} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <AddButton
                            type='button'
                            variant='secondary'
                            onClick={onClose}>
                            Cancel
                        </AddButton>
                        <AddButton
                            type='submit'>
                            {event ? "Update" : "Save"}
                        </AddButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default EventModal


