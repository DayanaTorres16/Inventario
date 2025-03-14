import React, { useState } from 'react';
import './Login.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import anchetaLogin from '../../assets/anchetaLogin.jpg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
              localStorage.setItem('token', data.token);
              const decodedToken = jwtDecode(data.token);
              const role = decodedToken.role;
              const nombre = decodedToken.nombre;
              const apellido = decodedToken.apellido;
              localStorage.setItem('role', role);
              localStorage.setItem('nombre', nombre);
              localStorage.setItem('apellido', apellido);
              console.log("Rol guardado:", role);
              console.log("Nombre guardado:", nombre);
              console.log("Apellido guardado:", apellido);
              navigate('/firstscreen');
          } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión');
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
                    <h3>Welcome to Alfa y Omega</h3>
                    <p>Please enter your details to continue</p>

                    <div className='formGroup'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='formGroup'>
                        <label htmlFor="password" className='passwordLabel'>Password</label>
                        <input
                            type="password"
                            id="passwordLogin"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className='loginButton' onClick={handleLogin}>Log In</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;