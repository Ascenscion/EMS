import React, { useEffect } from "react"
import Modal from "../components/Modal"
import AddButton from "../components/AddButton"
import InputWrap from "./InputWrap"
import { useForm } from "react-hook-form"


const AddUserModal = ({ isOpen, onClose, onSubmit, user }) => {
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
            password: "",
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
                password: "",
                department_id: user.department_id || "",
                role_id: user.role_id || "",
            });
        } else {
            reset({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                password: "",
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
            <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-4">
                <div>
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
                <div>
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
                <div>
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
                {!user &&
                    <InputWrap
                        label="Password"
                        name="password"
                        type="password"
                        register={register} />}
                <InputWrap label="Department" name="department_id" register={register} />
                <InputWrap label="Role" name="role_id" register={register} />


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

export default AddUserModal