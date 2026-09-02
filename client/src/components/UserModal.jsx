import React, { useEffect } from "react"
import Modal from "./Modal"
import AddButton from "./AddButton"
import InputWrap from "./InputWrap"
import { useForm } from "react-hook-form"


const UserModal = ({ isOpen, onClose, onSubmit, user, roles, departments, isSaving }) => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            middle_name: "",
            dob: "",
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
                middle_name: user.middle_name || "",
                last_name: user.last_name || "",
                dob: user.dob || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                emergency_contact: user.emergency_contact || "",
                emergency_phone: user.emergency_phone || "",
                department_id: user.department_id || "",
                role_id: user.role_id || "",
            });
        } else {
            reset({
                first_name: "",
                middle_name: "",
                last_name: "",
                dob: "",
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
        try {
            await onSubmit(data, user)
        } catch (error) {
            if (error.response?.data?.error == "Email already registered") {
                setError("email", {
                    type: "server",
                    message: "Email already registered.",
                })
            }
        }

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
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
                                    message: "First name can only contain letters."
                                },
                                validate: value => value.trim() !== "" || "First name cannot be empty"
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
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
                                    message: "Middle name can only contain letters."
                                }
                            }}
                            error={errors.middle_name}
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
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
                                    message: "Last name can only contain letters"
                                },
                                validate: value => value.trim() !== "" || "Last name cannot be empty"
                            }}
                            error={errors.last_name}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="DOB"
                            name="dob"
                            type="date"
                            register={register}
                            rules={{
                                required: "Date of birth is required",
                                validate: {
                                    notInFuture: (value) => {
                                        const selectedDate = new Date(value);
                                        const today = new Date();

                                        // Remove time portion
                                        today.setHours(0, 0, 0, 0);

                                        return (
                                            selectedDate <= today ||
                                            "Date of birth cannot be in the future"
                                        );
                                    },

                                    minimumAge: (value) => {
                                        const birthDate = new Date(value);
                                        const today = new Date();

                                        let age = today.getFullYear() - birthDate.getFullYear();
                                        const monthDiff =
                                            today.getMonth() - birthDate.getMonth();

                                        if (
                                            monthDiff < 0 ||
                                            (monthDiff === 0 &&
                                                today.getDate() < birthDate.getDate())
                                        ) {
                                            age--;
                                        }

                                        return age >= 18 || "User must be at least 18 years old";
                                    },

                                    realisticAge: (value) => {
                                        const birthDate = new Date(value);
                                        const today = new Date();

                                        let age = today.getFullYear() - birthDate.getFullYear();

                                        return age <= 100 || "Please enter a valid date of birth";
                                    },
                                },
                            }}
                            error={errors.dob} />
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
                            rules={{
                                pattern: {
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
                                    message: "Contact name can only contain letters"
                                }
                            }}
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <InputWrap
                            label="Emergency Phone"
                            name="emergency_phone"
                            register={register}
                            rules={{
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
                    }))}
                    rules={{
                        required: "Department is required."
                    }}
                    error={errors.department_id} />
                <InputWrap
                    label="Role"
                    name="role_id"
                    type="select"
                    register={register}
                    options={roles.map(role => ({
                        value: role.id,
                        label: role.name
                    }))}
                    rules={{
                        required: "Role is required."
                    }}
                    error={errors.role_id} />


                <div className="flex justify-end gap-2 mt-4">
                    <AddButton
                        type="button"
                        variant="secondary"
                        onClick={onClose}>
                        Cancel
                    </AddButton>
                    <AddButton
                        type="submit"
                        disabled={isSaving}>
                        {isSaving ? "Saving..." : user ? "Update" : "Save"}
                    </AddButton>
                </div>
            </form>

        </Modal>
    )
}

export default UserModal
