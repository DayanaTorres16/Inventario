import { useState } from "react";
import './Modals.css';

const UpdateStockModal = ({ isOpen, onClose, onUpdate, products }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedAttribute, setSelectedAttribute] = useState("");
    const [newAttribute, setNewAttribute] = useState("");
    const [newAttributeValue, setNewAttributeValue] = useState("");
    const [stockChange, setStockChange] = useState(0);
    const [priceChange, setPriceChange] = useState("");
    const [addingAttribute, setAddingAttribute] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
            <h3>Actualizar Stock</h3>
            
            <select 
                value={selectedProduct?.ID || ""} 
                onChange={(e) => {
                    const product = products.find(p => p.ID === Number(e.target.value));
                    setSelectedProduct(product);
                    setSelectedAttribute("");
                    setAddingAttribute(false);
                }}
            >
                <option value="" disabled>Seleccione un producto...</option>
                {products.map((product) => (
                    <option key={product.ID} value={product.ID}>{product.NOMBRE_PRODUCTO}</option>
                ))}
            </select>
            
            {selectedProduct?.atributos?.length > 0 && (
                <>
                    <select 
                        value={selectedAttribute} 
                        onChange={(e) => setSelectedAttribute(e.target.value)}
                    >
                        <option value="" disabled>Seleccione un atributo...</option>
                        {selectedProduct.atributos.map((attr) => (
                            <option key={attr.nombre} value={attr.nombre}>{attr.nombre}</option>
                        ))}
                        <option value="new">Agregar atributo</option>
                    </select>
                </>
            )}
            
            {(selectedAttribute === "new" || !selectedProduct?.atributos?.length) && (
                <>
                    <button onClick={() => setAddingAttribute(true)}>Agregar nuevo atributo</button>
                    {addingAttribute && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Nombre del atributo" 
                                value={newAttribute} 
                                onChange={(e) => setNewAttribute(e.target.value)}
                            />
                            <input 
                                type="text" 
                                placeholder="Valor del atributo" 
                                value={newAttributeValue} 
                                onChange={(e) => setNewAttributeValue(e.target.value)}
                            />
                        </>
                    )}
                </>
            )}
            
            <input 
                type="number" 
                placeholder="Cantidad de stock" 
                value={stockChange} 
                onChange={(e) => setStockChange(Number(e.target.value))} 
            />
            
            <input 
                type="number" 
                placeholder="Nuevo precio" 
                value={priceChange} 
                onChange={(e) => setPriceChange(Number(e.target.value))} 
            />
            
            <button 
                onClick={() => {
                    onUpdate({
                        productId: selectedProduct.ID,
                        attribute: selectedAttribute || newAttribute,
                        attributeValue: newAttributeValue,
                        stockChange,
                        priceChange,
                    });
                    onClose();
                }}
                disabled={!selectedProduct || (!stockChange && !priceChange)}
            >Actualizar</button>
            <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default UpdateStockModal;
