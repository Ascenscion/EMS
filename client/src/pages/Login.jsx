// src/pages/Login.jsx

import React from "react"
import { useForm } from "react-hook-form"
import InputWrap from "../components/InputWrap"
import AddButton from "../components/AddButton"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/loginService"
import { useState } from "react"

const Login = () => {
    const [loginError, setLoginError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    const submitHandler = async (formData) => {
        try {
            setLoginError("")
            const data = await loginUser(formData)
            localStorage.removeItem("authToken")
            localStorage.setItem("user", JSON.stringify(data.user))
            navigate("/")
        } catch (error) {
            setLoginError(
                error.response?.data?.message || "Login failed"
            )
        }
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
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email",
                            }
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
                    {loginError && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
                            {loginError}
                        </div>
                    )}
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
