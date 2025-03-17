import { useState } from "react";
import AddProductModal from "../Modals/AddProductModal";
import AddProductModalTienda2 from "../Modals/AddProductModal2";
import SellProductModal from "../Modals/SellProductModal";
import './ProductActions.css';

const ProductActions = ({ product, onAdd, onUpdateStock, onSell, products, tiendaActual }) => { // Agrega tiendaActual como prop
    const [modal, setModal] = useState("");

    const handleAgregarClick = () => {
        if (tiendaActual === 1) {
            setModal("addTienda1");
        } else if (tiendaActual === 2) {
            setModal("addTienda2");
        }
    };

    return (
        <div className="product-actions">
            <button onClick={handleAgregarClick}>Agregar</button>
            <button onClick={() => setModal("sell")}>Registrar Venta</button>

            <AddProductModal isOpen={modal === "addTienda1"} onClose={() => setModal("")} onAdd={onAdd} />
            <AddProductModalTienda2 isOpen={modal === "addTienda2"} onClose={() => setModal("")} onAdd={onAdd} />
            <SellProductModal isOpen={modal === "sell"} onClose={() => setModal("")} onSell={onSell} products={products} />
        </div>
    );
};

export default ProductActions;