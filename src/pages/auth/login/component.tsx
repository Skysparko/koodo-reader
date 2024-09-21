import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./index.css"
import axios from "axios";
import toast from "react-hot-toast";
import { ReactCookieProps } from "react-cookie";
import axiosInstance from "../../../config/axios.config";

// Create a functional form component for login
const LoginForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
            <button type="submit">Login</button>
        </form>
    );
};

interface ILoginProps extends RouteComponentProps, ReactCookieProps {

}


// Class-based Login component
class Login extends Component<ILoginProps> {
    handleLogin = async (data: any) => {
        console.log("Login Data:", data);
        const { cookies } = this.props;
        try {
            const response = await axiosInstance.post(`users/login`, data);

            const token = response.data.token
            if (token) {
                console.log("token",token)
                cookies?.set('token', token, { path: '/' });
                toast.success("Successfully Logined In.")
                this.props.history.push("/manager")
            }
            return response.data;
        } catch (error) {
            toast.success("Error Login User.")
        }

       
        // Implement your registration logic here
        // On successful registration, redirect using this.props.history.push("/path");
    };

    render() {
        return (
            <div className="login-container">
                <h2>Login</h2>
                <LoginForm onSubmit={this.handleLogin} />
                <a onClick={() => this.props.history.push('/register')}>New Here? Register</a>
            </div>
        );
    }
}

export default Login;
