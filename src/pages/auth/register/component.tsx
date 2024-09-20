import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./index.css";

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

// Class-based Register component
class Register extends Component<RouteComponentProps> {
    handleRegister = (data: any) => {
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