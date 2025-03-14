import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import anchetaLogin from '../../assets/anchetaLogin.jpg';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Error en la autenticación");
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                nombre: data.usuario.nombre,
                rol: data.usuario.rol
            }));

            navigate("/dashboard");

        } catch (error) {
            console.error("Error en la autenticación:", error);
            setError("Ocurrió un error, intenta de nuevo.");
        }
    };

    return (
        <div>
            <Header />
            <div className='loginScreen'>
                <div className='leftLogin'>
                    <img src={anchetaLogin} alt="Ancheta" />
                </div>
                <div className='rightLogin'>
                    <h3>Log in to Alfa y Omega</h3>
                    <p>Welcome! Please log in to continue</p>
                    <div className='formGroup'>
                        <label htmlFor="email">Email</label>
                        <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor="password" className='passwordLabel'>Password</label>
                        <input type="password" id="passwordLogin" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className='loginButton' onClick={handleLogin}>Log In</button>
                    {error && <p className="errorMessage">{error}</p>}
                    <Link to="/passwordreset">
                        <p className='forgotPassword'>Forgot your password?</p>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;

