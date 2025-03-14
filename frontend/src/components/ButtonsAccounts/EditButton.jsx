import React, { useState } from "react";
import "./ButtonsAccounts.css";

const EditButton = ({ userId, userName, userLastName, userEmail, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    nombre: userName,
    apellido: userLastName,
    email: userEmail,
  });

  const [errors, setErrors] = useState({ nombre: "", apellido: "", email: "" });

  // Función para validar los campos
  const validateInput = (name, value) => {
    if (name === "nombre" || name === "apellido") {
      return /^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(value) ? "" : "Solo letras permitidas";
    }
    if (name === "email") {
      return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) ? "" : "Email no válido";
    }
    return "";
  };

  // Manejar cambios en los inputs con validación
  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);

    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  // Guardar cambios en la base de datos
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Verificar si hay errores antes de enviar
    if (errors.nombre || errors.apellido || errors.email) {
      alert("Corrige los errores antes de guardar.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Usuario actualizado correctamente");
        if (onEdit) {
          onEdit(data);
        }
        setIsModalOpen(false);
      } else {
        alert("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un problema con la actualización");
    }
  };

  return (
    <>
      <button className="btn-edit" onClick={() => setIsModalOpen(true)}>
        Editar
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <form onSubmit={handleSaveChanges}>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={updatedUser.nombre}
                  onChange={handleChange}
                  required
                />
                {errors.nombre && <p className="error-text">{errors.nombre}</p>}
              </div>
              <div>
                <label>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={updatedUser.apellido}
                  onChange={handleChange}
                  required
                />
                {errors.apellido && <p className="error-text">{errors.apellido}</p>}
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="modal-buttons">
                <button type="submit" disabled={errors.nombre || errors.apellido || errors.email}>
                  Guardar cambios
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditButton;
