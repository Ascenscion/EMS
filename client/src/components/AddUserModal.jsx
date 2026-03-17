import React from "react"
import Modal from "../components/Modal"
import AddButton from "../components/AddButton"
import Input from "../components/Input"
import { useForm } from "react-hook-form"


const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
    const { register, handleSubmit, reset } = useForm()

    const submitHandler = (data) => {
        onSubmit(data)
        reset()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User">

            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">

                <Input label="First Name" name="first_name" register={register} />
                <Input label="Last Name" name="last_name" register={register} />
                <Input label="Email" name="email" register={register} type="email" />
                <Input label="Phone" name="phone" register={register} />
                <Input label="Password" name="password" register={register} />
                <Input label="Department" name="department_id" register={register} />
                <Input label="Role" name="role_id" register={register} />


                <div className="flex justify-end gap-2 mt-4">
                    <AddButton variant="secondary" onClick={onClose}>
                        Cancel
                    </AddButton>
                    <AddButton type="submit">
                        Save
                    </AddButton>
                </div>

            </form>

        </Modal>
    )
}

export default AddUserModal