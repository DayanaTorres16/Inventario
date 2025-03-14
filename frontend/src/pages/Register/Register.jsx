import React, { useState } from "react";
import "./Register.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import anchetaLogin from "../../assets/anchetaLogin.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("empleado");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!name || !lastName || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError(""); 
    setMessage("");

    // Datos a enviar al backend
    const userData = {
      nombre: name,
      apellido: lastName,
      email,
      contraseña: password,  // Ahora se envía correctamente
      rol: role
    };

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        setMessage("Usuario registrado exitosamente.");
        setName("");
        setLastName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "Error en el registro.");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="containerRegister">
        <div>
          <img src={anchetaLogin} alt="Ancheta" />
        </div>
        <div className="formRegister">
          <h3>Crear su cuenta</h3>
          <p>Bienvenido! Por favor complete los datos para registrarse.</p>
          
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleRegister}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="emailRegister"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="passwordRegister"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="container">
              <label>Seleccione el rol:</label>
              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setRole("administrador")}
                  className={role === "administrador" ? "btn active" : "btn"}
                >
                  Administrador
                </button>
                <button
                  type="button"
                  onClick={() => setRole("empleado")}
                  className={role === "empleado" ? "btn active" : "btn"}
                >
                  Empleado
                </button>
              </div>
            </div>

            <button type="submit" className="btnRegister">
              Registrar
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;