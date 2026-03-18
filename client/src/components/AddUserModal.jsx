import React, { useEffect } from "react"
import Modal from "../components/Modal"
import AddButton from "../components/AddButton"
import Input from "../components/Input"
import { useForm } from "react-hook-form"


const AddUserModal = ({ isOpen, onClose, onSubmit, user }) => {
    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        if (user) {
            reset(user);
        } else {
            reset({});
        }
    }, [user, reset])

    const submitHandler = (data) => {
        onSubmit(data, user)
        //reset()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit User" : "Add New User"}>

            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">

                <Input label="First Name" name="first_name" register={register} />
                <Input label="Last Name" name="last_name" register={register} />
                <Input label="Email" name="email" register={register} type="email" />
                <Input label="Phone" name="phone" register={register} />
                {!user && <Input label="Password" name="password" register={register} />}
                <Input label="Department" name="department_id" register={register} />
                <Input label="Role" name="role_id" register={register} />


                <div className="flex justify-end gap-2 mt-4">
                    <AddButton variant="secondary" onClick={onClose}>
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