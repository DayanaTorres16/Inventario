import { useState } from "react";
import './Modals.css';

const AddSaleModal = ({ isOpen, onClose, onAddSale, products }) => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedAttribute, setSelectedAttribute] = useState("");
    const [selectedAttributeValue, setSelectedAttributeValue] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = () => {
        const saleData = {
            productId: selectedProduct,
            attribute: selectedAttribute || null,
            attributeValue: selectedAttributeValue || null,
            quantity,
            price
        };
        onAddSale(saleData);
        onClose();
    };

    if (!isOpen) return null;

    const selectedProductData = products.find(p => p.ID === Number(selectedProduct));
    const attributes = selectedProductData?.attributes || [];
    const attributeValues = attributes.find(attr => attr.name === selectedAttribute)?.values || [];

    return (
        <div className="modal">
            <div className="modal-content">
            <h3>Registrar Venta</h3>
            <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
            >
                <option value="" disabled>Seleccione un producto...</option>
                {products.map((product) => (
                    <option key={product.ID} value={product.ID}>{product.NOMBRE_PRODUCTO}</option>
                ))}
            </select>

            {selectedProduct && attributes.length > 0 && (
                <>
                    <select 
                        value={selectedAttribute} 
                        onChange={(e) => setSelectedAttribute(e.target.value)}
                    >
                        <option value="" disabled>Seleccione un atributo...</option>
                        {attributes.map((attr, index) => (
                            <option key={index} value={attr.name}>{attr.name}</option>
                        ))}
                    </select>
                    
                    {selectedAttribute && attributeValues.length > 0 && (
                        <select 
                            value={selectedAttributeValue} 
                            onChange={(e) => setSelectedAttributeValue(e.target.value)}
                        >
                            <option value="" disabled>Seleccione un valor del atributo...</option>
                            {attributeValues.map((value, index) => (
                                <option key={index} value={value}>{value}</option>
                            ))}
                        </select>
                    )}
                </>
            )}
            
            <input 
                type="number" 
                placeholder="Cantidad Vendida" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
            />
            <input 
                type="number" 
                placeholder="Precio de Venta" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
            />
            
            <button onClick={handleSubmit} disabled={!selectedProduct || !quantity || !price}>✅ Registrar Venta</button>
            <button onClick={onClose}>❌ Cancelar</button>
            </div>
        </div>
    );
};

export default AddSaleModal;