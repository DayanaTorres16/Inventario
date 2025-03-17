import React, { useState, useEffect } from "react";
import "./Modals.css";

const UpdateStockModal = ({ isOpen, onClose, onUpdate, product, atributosDisponibles }) => {
    const [nuevoStock, setNuevoStock] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [atributosSeleccionados, setAtributosSeleccionados] = useState({});
    const [nuevosStocksAtributos, setNuevosStocksAtributos] = useState({});
    const [agregarNuevoAtributo, setAgregarNuevoAtributo] = useState(false);
    const [nuevoAtributoSeleccionado, setNuevoAtributoSeleccionado] = useState("");
    const [nuevoValorAtributo, setNuevoValorAtributo] = useState("");
    const [nuevaCantidadAtributo, setNuevaCantidadAtributo] = useState("");

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen]);

    const resetForm = () => {
        setNuevoStock("");
        setError(null);
        setLoading(false);
        setAtributosSeleccionados({});
        setNuevosStocksAtributos({});
        setAgregarNuevoAtributo(false);
        setNuevoAtributoSeleccionado("");
        setNuevoValorAtributo("");
        setNuevaCantidadAtributo("");
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            let requestBody = { atributos: [] };

            // Verificar si hay atributos seleccionados
            const atributosModificados = Object.keys(atributosSeleccionados).filter(key => atributosSeleccionados[key]);

            if (atributosModificados.length > 0) {
                requestBody.atributos = (product.atributos || [])
                    .filter(atributo => atributosModificados.includes(`${atributo.ID_ATRIBUTO}-${atributo.VALOR_ATRIBUTO}`))
                    .map(atributo => ({
                        ID_ATRIBUTO: atributo.ID_ATRIBUTO,
                        VALOR_ATRIBUTO: atributo.VALOR_ATRIBUTO,
                        CANTIDAD_STOCK: parseInt(nuevosStocksAtributos[`${atributo.ID_ATRIBUTO}-${atributo.VALOR_ATRIBUTO}`] || 0, 10)
                    }));
            } else {
                requestBody.stock = parseInt(nuevoStock, 10) || 0;
            }

            // Agregar nuevo atributo si se seleccionó
            if (agregarNuevoAtributo && nuevoAtributoSeleccionado && nuevoValorAtributo && nuevaCantidadAtributo) {
                requestBody.atributos.push({
                    ID_ATRIBUTO: nuevoAtributoSeleccionado,
                    VALOR_ATRIBUTO: nuevoValorAtributo,
                    CANTIDAD_STOCK: parseInt(nuevaCantidadAtributo, 10)
                });
            }

            const response = await fetch(`http://localhost:3000/productos/${product.ID_PRODUCTO}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Error al actualizar el producto en el backend");

            // Actualizar el estado local con los nuevos stocks
            const nuevosAtributos = agregarNuevoAtributo && nuevoAtributoSeleccionado && nuevoValorAtributo && nuevaCantidadAtributo
                ? [...(product.atributos || []), {
                    ID_ATRIBUTO: nuevoAtributoSeleccionado,
                    NOMBRE_ATRIBUTO: atributosDisponibles.find(attr => attr.ID_ATRIBUTO === nuevoAtributoSeleccionado)?.NOMBRE_ATRIBUTO,
                    VALOR_ATRIBUTO: nuevoValorAtributo,
                    CANTIDAD_STOCK: parseInt(nuevaCantidadAtributo, 10)
                }]
                : (product.atributos || []);

            onUpdate({
                ...product,
                atributos: nuevosAtributos.map(attr => {
                    const key = `${attr.ID_ATRIBUTO}-${attr.VALOR_ATRIBUTO}`;
                    return atributosSeleccionados[key]
                        ? { ...attr, CANTIDAD_STOCK: attr.CANTIDAD_STOCK + parseInt(nuevosStocksAtributos[key] || 0, 10) }
                        : attr;
                }),
                CANT_DISPONIBLE: product.CANT_DISPONIBLE + (requestBody.stock || 0)
            });

            onClose();

        } catch (error) {
            console.error("Error al actualizar stock:", error);
            setError("No se pudo actualizar el stock. Intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (id, valor) => {
        const key = `${id}-${valor}`;
        setAtributosSeleccionados(prev => ({
            ...prev,
            [key]: !prev[key],
        }));

        if (!atributosSeleccionados[key]) {
            setNuevosStocksAtributos(prev => ({
                ...prev,
                [key]: product.atributos.find(attr => attr.ID_ATRIBUTO === id && attr.VALOR_ATRIBUTO === valor)?.CANTIDAD_STOCK || 0,
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Actualizar Stock</h3>
                {error && <p className="error-message">{error}</p>}
                {loading && <p>Cargando...</p>}
                <p>Producto: {product?.NOMBRE_PRODUCTO || product?.nombre}</p>

                {product?.atributos?.length > 0 ? (
                    <div>
                        <p>Seleccione los atributos para actualizar el stock:</p>
                        <ul>
                            {(product.atributos || []).map(atributo => {
                                const key = `${atributo.ID_ATRIBUTO}-${atributo.VALOR_ATRIBUTO}`;
                                return (
                                    <li key={key}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={atributosSeleccionados[key] || false}
                                                onChange={() => handleCheckboxChange(atributo.ID_ATRIBUTO, atributo.VALOR_ATRIBUTO)}
                                            />
                                            {atributo.NOMBRE_ATRIBUTO}: {atributo.VALOR_ATRIBUTO} (Stock: {atributo.CANTIDAD_STOCK})
                                        </label>
                                        {atributosSeleccionados[key] && (
                                            <input
                                                type="number"
                                                value={nuevosStocksAtributos[key] || ""}
                                                onChange={(e) => setNuevosStocksAtributos({
                                                    ...nuevosStocksAtributos,
                                                    [key]: e.target.value,
                                                })}
                                                placeholder="Nuevo stock"
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <p>Stock actual: {product?.CANT_DISPONIBLE || product?.stock}</p>
                        <input
                            type="number"
                            placeholder="Nuevo stock"
                            value={nuevoStock}
                            onChange={(e) => setNuevoStock(e.target.value)}
                        />
                    </div>
                )}

                <div className="modal-actions">
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                    <button onClick={onClose} disabled={loading}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateStockModal;