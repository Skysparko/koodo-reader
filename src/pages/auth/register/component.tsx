import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./index.css";
import axios from "axios";
import toast from "react-hot-toast";
import { ReactCookieProps } from "react-cookie";
import { WithTranslationProps } from "react-i18next";
import axiosInstance from "../../../config/axios.config";

// Create a functional form component for registration
const RegisterForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="field-container">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    {...register("username", { required: "Username is required" })}
                />
                {errors.username && <p className="error">{errors.username.message as string}</p>}
            </div>
            <div className="field-container">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email format"
                        }
                    })}
                />
                {errors.email && <p className="error">{errors.email.message as string}</p>}
            </div>
            <div className="field-container">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="error">{errors.password.message as string}</p>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

interface RegisterProps extends WithTranslationProps, ReactCookieProps {
    cookies:any,
    history:any
    currentBook: any; // Replace 'any' with the actual type for currentBook
    percentage: number;
    htmlBook: any; // Replace 'any' with the actual type for htmlBook
    handleFetchNotes: () => void;
    handleFetchBookmarks: () => void;
    handleFetchBooks: () => void;
    handleReadingBook: (book: any) => void; // Replace 'any' with actual book type
    handleFetchPercentage: (book: any) => void; // Replace 'any' with actual book type
}

// Class-based Register component
class Register extends Component<RegisterProps> {
    handleRegister = async (data: any) => {
        const { cookies } = this.props;
        try {
            const response = await axiosInstance.post(`users/signup`, data);

            const token = response.data.token
            if(token){
                cookies.set('token', token, { path: '/' });
                toast.success("Successfully Registered.")
                this.props.history.push("/manager")
            }
            return response.data;
        } catch (error) {
            toast.success("Error Registering User.")
        }

        console.log("Registration Data:", data);
        // Implement your registration logic here
        // On successful registration, redirect using this.props.history.push("/path");
    };

    render() {
        return (
            <div className="login-container">
                <h2>Register</h2>
                <RegisterForm onSubmit={this.handleRegister} />
                <a onClick={() => this.props.history.push('/')}>Already Registered? Login</a>

            </div>
        );
    }
}

export default Register