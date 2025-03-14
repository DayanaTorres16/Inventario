import React, { useState, useEffect } from 'react';
import EditButton from '../../components/ButtonsAccounts/EditButton';
import DeleteButton from '../../components/ButtonsAccounts/DeleteButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import './AccountAdminPage.css';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const AccountAdmin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleEditUser = (userId) => {
        console.log(`Editar usuario con ID: ${userId}`);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await fetch(`http://localhost:3000/api/users/${userId}`, { method: 'DELETE' });
            setUsers(users.filter(user => user.id !== userId));
            alert('Usuario eliminado');
        } catch (error) {
            console.error('Error al eliminar el usuario', error);
        }
    };

    const handleRegisterUser = () => {
        navigate('/register');
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div>
            <Navbar />
            <div className="account-admin-container">
                <div className="admin-header">
                    <h2>Administrar Cuentas</h2>
                    <button onClick={handleRegisterUser} className="add-user-button">
                        Registrar Nuevo Usuario
                    </button>
                </div>

                
                <div>
                <SearchBar onSearch={handleSearchChange} />
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.nombre}</td>
                                <td>{user.apellido}</td>
                                <td>{user.email}</td>
                                <td>{user.rol}</td>
                                <td className="actions-cell">
                                    <EditButton
                                        userId={user.id}
                                        userName={user.nombre}
                                        userLastName={user.apellido}
                                        userEmail={user.email}
                                        userRole={user.rol}
                                        onEdit={handleEditUser}
                                        className="edit-button"
                                    />
                                    <DeleteButton userId={user.id} onDelete={handleDeleteUser} className="delete-button" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                    onPageChange={setCurrentPage}
                />
            </div>
            <Footer />
        </div>
    );
};

export default AccountAdmin;
