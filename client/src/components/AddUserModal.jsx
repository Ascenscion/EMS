import React, { useEffect } from "react"
import Modal from "../components/Modal"
import AddButton from "../components/AddButton"
import Input from "../components/Input"
import { useForm } from "react-hook-form"


const AddUserModal = ({ isOpen, onClose, onSubmit, user }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
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

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-4">
                <div>
                    <Input
                        label="First Name"
                        name="first_name"
                        register={(name) =>
                            register(name, {
                                required: "First name is required",
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "First name can only contain letters."
                                }
                            })
                        } />
                    {errors.first_name && (
                        <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        label="Last Name"
                        name="last_name"
                        register={(name) =>
                            register(name, {
                                required: "Last name is required",
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "Last name can only contain letters."
                                }
                            })
                        } />
                    {errors.last_name && (
                        <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        register={(name) =>
                            register(name, {
                                required: "Email is required"
                            })
                        } />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>

                    )}
                </div>
                <Input label="Phone" name="phone" register={register} />
                {!user && <Input label="Password" name="password" register={register} />}
                <Input label="Department" name="department_id" register={register} />
                <Input label="Role" name="role_id" register={register} />


                <div className="flex justify-end gap-2 mt-4">
                    <AddButton
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