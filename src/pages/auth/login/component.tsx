    import React, { Component } from "react";
    import { RouteComponentProps } from "react-router-dom";
    import { useForm } from "react-hook-form";
    import "./index.css"
import Axios from "axios";

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

    // Class-based Login component
    class Login extends Component<RouteComponentProps> {
    handleLogin = async (data: any) => {
        const response = await Axios.post(`http://localhost:8000/api/users/signup`, data);
        return response.data;
        console.log("Login Data:", data);
        // Implement your login logic here
        // On successful login, redirect using this.props.history.push("/path");
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
