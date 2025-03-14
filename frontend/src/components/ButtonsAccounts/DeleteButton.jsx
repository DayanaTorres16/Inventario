import React from 'react';
import './ButtonsAccounts.css'; 

const DeleteButton = ({ userId, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(userId);
    }
  };

  return (
    <button className="btn-delete" onClick={handleDelete}>
      Eliminar
    </button>
  );
};

export default DeleteButton;
