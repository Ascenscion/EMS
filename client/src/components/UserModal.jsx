import React, { useEffect } from "react"
import Modal from "./Modal"
import AddButton from "./AddButton"
import InputWrap from "./InputWrap"
import { useForm } from "react-hook-form"


const UserModal = ({ isOpen, onClose, onSubmit, user, roles, departments }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address: "",
            emergency_contact: "",
            emergency_phone: "",
            department_id: "",
            role_id: "",
        }
    })

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: "",
                emergency_contact: "",
                emergency_phone: "",
                department_id: user.department_id || "",
                role_id: user.role_id || "",
            });
        } else {
            reset({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                address: "",
                emergency_contact: "",
                emergency_phone: "",
                department_id: "",
                role_id: "",
            });
        }
    }, [user, isOpen, reset])

    const submitHandler = async (data) => {
        console.log("Modal form data: ", data);
        await onSubmit(data, user)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? "Edit User" : "Add New User"}>

            {/* InputWrap is a Wrapper that handles validation, needs rules and displays errors and also styles the Input component. */}
            {/* Register, rules, reset are useForm Hook props. */}
            {/* handleSubmit is a function from useForm */}
            {/* handleSubmit builds a data = {} object containing all the input fields, and handle the validation. Once validation is correct, it calls submitHandler */}
            {/* onSubit is the React form event */}
            {/* handleSubmit is from react-hook-form. Validates and collects all registerd input values */}
            {/* submitHandler is your function. React hook form calls it only if the form is valid. */}
            {/* User clicks Save
                → form onSubmit runs
                → handleSubmit checks validation
                → if valid, it builds data object
                → handleSubmit calls submitHandler(data)
                → submitHandler sends data to parent/backend */}
            <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-4">
                <div className="flex gap-2 w-full">
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="First Name"
                            name="first_name"
                            type="text"
                            register={register}
                            rules={{
                                required: "First name is required",
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "First name can only contain letters."
                                }
                            }}
                            error={errors.first_name}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Middle Name"
                            name="middle_name"
                            type="text"
                            register={register}
                            rules={{
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "Middle name can only contain letters."
                                }
                            }}
                            error={errors.first_name}
                        />
                    </div>
                </div>
                <div className='flex gap-2 w-full'>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Last Name"
                            name="last_name"
                            type="text"
                            register={register}
                            rules={{
                                required: "Last name is required",
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "Last name can only contain letters"
                                }
                            }}
                            error={errors.last_name}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="DOB"
                            name="start_date"
                            type="date"
                            register={register} />
                    </div>
                </div>

                <div className='flex gap-2 w-full'>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Email"
                            name="email"
                            type="text"
                            register={register}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Must contain valid email address"
                                }
                            }}
                            error={errors.email}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Phone"
                            name="phone"
                            register={register}
                            rules={{
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9()+-\s]{10,20}$/,
                                    message: "Must contain valid phone number"
                                }
                            }}
                            error={errors.phone} />
                    </div>
                </div>
                <div className='flex-1 min-w-0'>
                    <InputWrap
                        label="Address"
                        name="address"
                        register={register}
                        rules={{
                            required: "Address is required",
                        }}
                        error={errors.address} />
                </div>
                <div className='flex gap-2 w-full'>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Emergency Contact"
                            name="emergency_contact"
                            type="text"
                            register={register}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Emergency Phone"
                            name="emergency_phone"
                            register={register}
                            rules={{
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9()+-\s]{10,20}$/,
                                    message: "Must contain valid phone number"
                                }
                            }}
                        />
                    </div>
                </div>
                {!user
                    // &&
                    //     <InputWrap
                    //         label="Password"
                    //         name="password"
                    //         type="password"
                    //         register={register} />
                }
                <InputWrap
                    label="Department"
                    name="department_id"
                    type="select"
                    register={register}
                    options={departments.map((dep) => ({
                        value: dep.id,
                        label: dep.name
                    }))} />
                <InputWrap
                    label="Role"
                    name="role_id"
                    type="select"
                    register={register}
                    options={roles.map(role => ({
                        value: role.id,
                        label: role.name
                    }))} />


                <div className="flex justify-end gap-2 mt-4">
                    <AddButton
                        type="button"
                        variant="secondary"
                        onClick={onClose}>
                        Cancel
                    </AddButton>
                    <AddButton type="submit">
                        {user ? "Update" : "Save"}
                    </AddButton>
                </div>
            </form>

        </Modal>
    )
}

export default UserModal