import React, { useState, useRef, useEffect } from "react";
import './ProductsTable.css';
import UpdateStockModal from "../Modals/UpdateStockModal"; // Importa el modal de actualización de stock

const ProductsTable = ({ productos, onDelete, onDeleteAttribute, onOpenMenu, menuOpen, onCloseMenu }) => {
    const [confirmDelete, setConfirmDelete] = useState({ show: false, product: null });
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const menuRef = useRef(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [productToUpdate, setProductToUpdate] = useState(null);

    const handleConfirmDelete = (product) => {
        setConfirmDelete({ show: true, product });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ show: false, product: null });
    };

    const handleActualDelete = () => {
        if (confirmDelete.product) {
            onDelete(confirmDelete.product);
            setConfirmDelete({ show: false, product: null });
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            onCloseMenu();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCloseMenu]);

    const handleActualDeleteAttribute = () => {
        if (selectedAttribute && menuOpen.product) {
            console.log("Atributo seleccionado:", selectedAttribute);
            const encodedValorAtributo = encodeURIComponent(selectedAttribute.VALOR_ATRIBUTO);
            onDeleteAttribute(menuOpen.product, {
                VALOR_ATRIBUTO: encodedValorAtributo,
                ID_ATRIBUTO: selectedAttribute.ID_ATRIBUTO
            });
            onCloseMenu();
            setSelectedAttribute(null);
        }
    };

    const handleUpdateClick = (product) => {
        setProductToUpdate(product);
        setUpdateModalOpen(true);
    };

    const handleUpdateClose = () => {
        setUpdateModalOpen(false);
        setProductToUpdate(null);
    };

    const handleUpdateStock = (updatedProduct) => {
        setUpdateModalOpen(false);
        setProductToUpdate(null);
    };

    return (
        <div className="inventario-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Atributos</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos && productos.length > 0 ? (
                        productos.map((producto) => (
                            <tr key={producto.ID_PRODUCTO || producto.id}>
                                <td>{producto.NOMBRE_PRODUCTO || producto.nombre}</td>
                                <td>{producto.DESCRIPCION || producto.descripcion}</td>
                                <td>{producto.PRECIO_UNITARIO || producto.precio}</td>
                                <td>
                                    {Array.isArray(producto.atributos) && producto.atributos.length > 0 ? (
                                        producto.atributos.map((atributo) => (
                                            <div
                                                key={`${producto.ID_PRODUCTO || producto.id}-${atributo.VALOR_ATRIBUTO}`}
                                                onContextMenu={(e) => {
                                                    onOpenMenu(e, producto, atributo);
                                                }}
                                            >
                                                {atributo.NOMBRE_ATRIBUTO}: {atributo.VALOR_ATRIBUTO}
                                            </div>
                                        ))
                                    ) : (
                                        "Sin Atributos"
                                    )}
                                </td>
                                <td>
                                    {Array.isArray(producto.atributos) && producto.atributos.length > 0 ? (
                                        producto.atributos.map((atributo) => (
                                            <div key={`${producto.ID_PRODUCTO || producto.id}-${atributo.VALOR_ATRIBUTO}-stock`}>
                                                {atributo.CANTIDAD_STOCK}
                                            </div>
                                        ))
                                    ) : (
                                        producto.CANT_DISPONIBLE || producto.stock
                                    )}
                                </td>
                                <td>
                                    <button className="buttonDeleteTable" onClick={() => handleConfirmDelete(producto)}>Eliminar</button>
                                    <button className="buttonUpdateTable" onClick={() => handleUpdateClick(producto)}>Actualizar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {menuOpen.show && (
                <div
                    ref={menuRef}
                    className="action-menu"
                    style={{ position: 'fixed', left: menuOpen.position.x, top: menuOpen.position.y }}
                >
                    {Array.isArray(menuOpen.product?.atributos) && menuOpen.product.atributos.map((atributo) => (
                        <div
                            key={`${menuOpen.product.ID_PRODUCTO || menuOpen.product.id}-${atributo.VALOR_ATRIBUTO}`}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedAttribute === atributo}
                                onChange={() => setSelectedAttribute(atributo)}
                                style={{ marginRight: '8px' }}
                            />
                            {atributo.NOMBRE_ATRIBUTO}: {atributo.VALOR_ATRIBUTO}
                        </div>
                    ))}
                    {selectedAttribute && (
                        <button onClick={handleActualDeleteAttribute}>Eliminar Atributo</button>
                    )}
                </div>
            )}
            {confirmDelete.show && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <p>¿Estás seguro de que quieres eliminar {confirmDelete.product.NOMBRE_PRODUCTO}?</p>
                        <button className="buttonDeleteModal" onClick={handleActualDelete}>Eliminar</button>
                        <button onClick={handleCancelDelete}>Cancelar</button>
                    </div>
                </div>
            )}
            <UpdateStockModal
                isOpen={updateModalOpen}
                onClose={handleUpdateClose}
                onUpdate={handleUpdateStock}
                product={productToUpdate}
            />
        </div>
    );
};

export default ProductsTable;