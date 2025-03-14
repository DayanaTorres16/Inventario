import React, { useState, useEffect } from "react";
import './Modals.css';

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [agregarAtributo, setAgregarAtributo] = useState(false);
    const [atributos, setAtributos] = useState([]);
    const [atributoSeleccionado, setAtributoSeleccionado] = useState("");
    const [nuevoAtributo, setNuevoAtributo] = useState("");
    const [nuevoValorAtributo, setNuevoValorAtributo] = useState("");
    const [cantidadAtributo, setCantidadAtributo] = useState("");
    const [atributosExistentes, setAtributosExistentes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const idTienda = 1;

    useEffect(() => {
        if (isOpen) {
            setNombre("");
            setDescripcion("");
            setPrecio("");
            setStock("");
            setAgregarAtributo(false);
            setAtributos([]);
            setAtributoSeleccionado("");
            setNuevoAtributo("");
            setNuevoValorAtributo("");
            setCantidadAtributo("");
            obtenerAtributosExistentes();
            setError(null);
        }
    }, [isOpen]);

    const obtenerAtributosExistentes = async () => {
        try {
            const response = await fetch("http://localhost:3000/atributos");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAtributosExistentes(data);
        } catch (error) {
            console.error("Error al obtener atributos:", error);
            setError("Error al obtener atributos.");
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            const nuevoProducto = {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                stock: agregarAtributo ? null : parseInt(stock),
                tiendaId: idTienda,
                atributos: agregarAtributo ? atributos : [],
            };

            const response = await fetch("http://localhost:3000/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onAdd(data);
            onClose();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setError("Error al agregar producto.");
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarAtributo = () => {
        if (atributoSeleccionado === "nuevo" && nuevoAtributo && nuevoValorAtributo && cantidadAtributo) {
            setAtributos([
                ...atributos,
                {
                    nombre: nuevoAtributo,
                    valor: nuevoValorAtributo,
                    stock: parseInt(cantidadAtributo),
                },
            ]);
            setNuevoAtributo("");
            setNuevoValorAtributo("");
            setCantidadAtributo("");
        } else if (atributoSeleccionado && atributoSeleccionado !== "nuevo" && nuevoValorAtributo && cantidadAtributo) {
            const atributoExistente = atributosExistentes.find(attr => attr.ID_ATRIBUTO === parseInt(atributoSeleccionado));
            if (atributoExistente) {
                setAtributos([
                    ...atributos,
                    {
                        nombre: atributoExistente.NOMBRE_ATRIBUTO,
                        valor: nuevoValorAtributo,
                        stock: parseInt(cantidadAtributo),
                    },
                ]);
                setNuevoValorAtributo("");
                setCantidadAtributo("");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Agregar Producto</h3>
                {error && <p className="error-message">{error}</p>}
                {loading && <p>Cargando...</p>}
                <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <textarea placeholder="Descripción del producto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                <input
                    type="number"
                    placeholder="Stock del producto"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    disabled={agregarAtributo}
                />

                <label>
                    <input type="checkbox" checked={agregarAtributo} onChange={(e) => setAgregarAtributo(e.target.checked)} />
                    ¿Desea agregar un atributo al producto?
                </label>

                {agregarAtributo && (
                    <div>
                        <select value={atributoSeleccionado} onChange={(e) => setAtributoSeleccionado(e.target.value)}>
                            <option value="">Seleccione un atributo...</option>
                            <option value="nuevo">Nuevo atributo</option>
                            {atributosExistentes.map(attr => (
                                <option key={attr.ID_ATRIBUTO} value={attr.ID_ATRIBUTO}>{attr.NOMBRE_ATRIBUTO}</option>
                            ))}
                        </select>

                        {atributoSeleccionado === "nuevo" && (
                            <input type="text" placeholder="Nombre del nuevo atributo" value={nuevoAtributo} onChange={(e) => setNuevoAtributo(e.target.value)} />
                        )}

                        <input type="text" placeholder="Valor del atributo" value={nuevoValorAtributo} onChange={(e) => setNuevoValorAtributo(e.target.value)} />
                        <input type="number" placeholder="Cantidad del atributo" value={cantidadAtributo} onChange={(e) => setCantidadAtributo(e.target.value)} />
                        <button onClick={handleAgregarAtributo}>Agregar atributo</button>

                        {atributos.length > 0 && (
                            <ul>
                                {atributos.map((atributo, index) => (
                                    <li key={index}>
                                        {atributo.nombre}: {atributo.valor} (Cantidad: {atributo.stock})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Agregando..." : "Agregar"}
                </button>
                <button onClick={onClose} disabled={loading}>Cancelar</button>
            </div>
        </div>
    );
};

export default AddProductModal;