import React from 'react'
import Modal from './Modal'
import { useForm } from 'react-hook-form'
import InputWrap from './InputWrap'
import AddButton from './AddButton'
import TextAreaWrap from './TextAreaWrap'
import { useEffect } from 'react'

const EventModal = ({ isOpen, onClose, event, onSubmit, isSaving }) => {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
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
                            label="Event Name"
                            placeHolder="Event name"
                            name="name"
                            register={register}
                            rules={{
                                required: "Event name is required.",
                                minLength: {
                                    value: 2,
                                    message: "Event name must be at least 2 characters."
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Event name cannot exceed 100 characters."
                                },
                                validate: value => value.trim() !== "" || "Event name cannot be empty."
                            }}
                            error={errors.name} />
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                label="Start Date"
                                name="start_date"
                                type="date"
                                register={register}
                                rules={{
                                    required: "Start date is required.",
                                }}
                                error={errors.start_date} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                label="End Date"
                                name="end_date"
                                type="date"
                                register={register}
                                rules={{
                                    required: "End date is required.",
                                    validate: value => {
                                        const startDate = getValues("start_date");
                                        if (!startDate || !value) return true;
                                        return (
                                            new Date(value) >= new Date(startDate) ||
                                            "End date must be after start date."
                                        );
                                    }
                                }}
                                error={errors.end_date} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                label="Staff Needed"
                                placeHolder="Staff #"
                                name="max_users"
                                type="number"
                                register={register}
                                rules={{
                                    required: "Max users is required.",
                                    min: {
                                        value: 1,
                                        message: "Max users must be at least 1."
                                    },
                                    validate: value =>
                                        Number.isInteger(Number(value)) ||
                                        "Max users must be a whole number."
                                }}
                                error={errors.max_users} />
                        </div>
                    </div>
                    {/* <hr />
                    work on Shift
                    <hr /> */}
                    <div>
                        <InputWrap
                            label="Location Name"
                            placeHolder="Location name"
                            name="location_name"
                            type="text"
                            register={register}
                            rules={{
                                required: "Location name is required.",
                                minLength: {
                                    value: 2,
                                    message: "Location name must be at least 2 characters."
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Location name cannot exceed 100 characters."
                                },
                                validate: value => value.trim() !== "" || "Location name cannot be empty."
                            }}
                            error={errors.location_name} />
                    </div>
                    <div>
                        <InputWrap
                            label="Address Line 1"
                            placeHolder="Address Line 1"
                            name="address_line_1"
                            type="text"
                            register={register}
                            rules={{
                                required: "Address line 1 is required.",
                                minLength: {
                                    value: 2,
                                    message: "Address line 1 must be at least 2 characters."
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Address line 1 cannot exceed 100 characters."
                                },
                                validate: value => value.trim() !== "" || "Address line 1 cannot be empty."
                            }}
                            error={errors.address_line_1} />
                    </div>
                    <div>
                        <InputWrap
                            label="Address Line 2"
                            placeHolder="Apr, suite, or Unit"
                            name="address_line_2"
                            type="text"
                            register={register}
                            rules={{
                                maxLength: {
                                    value: 100,
                                    message: "Address line 2 cannot exceed 100 characters."
                                }
                            }}
                            error={errors.address_line_2} />
                    </div>
                    <div>
                        <InputWrap
                            label="City"
                            placeHolder="City"
                            name="city"
                            type="text"
                            register={register}
                            rules={{
                                required: "City is required.",
                                minLength: {
                                    value: 2,
                                    message: "City must be at least 2 characters."
                                },
                                maxLength: {
                                    value: 100,
                                    message: "City cannot exceed 100 characters."
                                },
                                validate: value => value.trim() !== "" || "City cannot be empty."
                            }}
                            error={errors.city} />
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                label="State"
                                placeHolder="State"
                                name="state"
                                type="text"
                                register={register}
                                rules={{
                                    required: "State is required.",
                                    minLength: {
                                        value: 2,
                                        message: "State must be at least 2 characters."
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "State cannot exceed 100 characters."
                                    },
                                    validate: value => value.trim() !== "" || "State cannot be empty."
                                }}
                                error={errors.state} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <InputWrap
                                label="Zip Code"
                                placeHolder="Zip code"
                                name="zip_code"
                                type="text"
                                register={register}
                                rules={{
                                    required: "Zip code is required.",
                                    pattern: {
                                        value: /^\d{5}(-\d{4})?$/,
                                        message: "Zip code must be 5 digits or ZIP+4."
                                    }
                                }}
                                error={errors.zip_code} />
                        </div>
                    </div>
                    <div>
                        <TextAreaWrap
                            label="Description"
                            placeHolder="Description"
                            name="description"
                            register={register}
                            rules={{
                                required: "Description is required.",
                                maxLength: {
                                    value: 500,
                                    message: "Description cannot exceed 500 characters."
                                },
                                validate: value => value.trim() !== "" || "Description cannot be empty."
                            }}
                            error={errors.description}
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
                            type='submit'
                            disabled={isSaving}>
                            {isSaving ? "Saving..." : event ? "Update" : "Save"}
                        </AddButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default EventModal

