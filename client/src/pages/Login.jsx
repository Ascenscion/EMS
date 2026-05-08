// src/pages/Login.jsx

import React from "react"
import { useForm } from "react-hook-form"
import InputWrap from "../components/InputWrap"
import AddButton from "../components/AddButton"

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const submitHandler = (formData) => {
        console.log("Login data:", formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        IEM Login
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Sign in to access your dashboard.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="flex flex-col gap-4"
                >
                    <InputWrap
                        label="Email"
                        name="email"
                        type="email"
                        placeHolder="Enter your email"
                        register={register}
                        rules={{
                            required: "Email is required"
                        }}
                        error={errors.email}
                    />

                    <InputWrap
                        label="Password"
                        name="password"
                        type="password"
                        placeHolder="Enter your password"
                        register={register}
                        rules={{
                            required: "Password is required"
                        }}
                        error={errors.password}
                    />

                    <AddButton
                        type="submit"
                        variant="primary"
                    >
                        Sign In
                    </AddButton>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-400">
                        Employee Management System
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login