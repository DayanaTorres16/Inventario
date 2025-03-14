import React, { useEffect, useState } from "react";
import '../Inventory.css';
import Navbar from "../../../components/Navbar/Navbar";
import ProductsTable from "../../../components/Products-Table/ProductsTable";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Pagination from "../../../components/Pagination/Pagination";
import Footer from "../../../components/Footer/Footer";
import ProductActions from "../../../components/ButtonsInventory/ProductActions";

const SecondPointInventory = () => {
    const [productosLocal, setProductosLocal] = useState([]);
    const idTienda = 2; // Tienda 2
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [menuOpen, setMenuOpen] = useState({ show: false, product: null, attribute: null, position: { x: 0, y: 0 } });

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await fetch(`http://localhost:3000/productos?storeId=${idTienda}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProductosLocal(data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };
        obtenerProductos();
    }, [idTienda]);

    const filteredProducts = productosLocal ? productosLocal.filter(product =>
        product.NOMBRE_PRODUCTO && product.NOMBRE_PRODUCTO.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const totalProducts = filteredProducts ? filteredProducts.length : 0;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct) : [];
    const totalPages = filteredProducts ? Math.ceil(totalProducts / productsPerPage) : 0;

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddProduct = (newProduct) => {
        setProductosLocal([...productosLocal, newProduct]);
    };

    const handleDeleteProduct = async (productToDelete) => {
        try {
            const response = await fetch(`http://localhost:3000/productos/${productToDelete.ID_PRODUCTO}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setProductosLocal(productosLocal.filter(producto => producto.ID_PRODUCTO !== productToDelete.ID_PRODUCTO));
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleUpdateStock = (updatedProduct) => {
        // Lógica de actualización de stock (si es necesario)
    };

    const handleSellProduct = (soldProduct) => {
        // Lógica de venta de producto (si es necesario)
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleDeleteAttribute = async (product, attribute) => {
        try {
            const url = `http://localhost:3000/productos/${product.ID_PRODUCTO}/atributos/${attribute.VALOR_ATRIBUTO}`;

            const response = await fetch(url, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.mensaje || 'Error al eliminar atributo'}`);
            }

            const updatedProductos = productosLocal.map((p) => {
                if (p.ID_PRODUCTO === product.ID_PRODUCTO) {
                    const updatedAttributes = p.atributos.filter((a) => {
                        return a.ID_ATRIBUTO !== attribute.ID_ATRIBUTO;
                    });
                    return { ...p, atributos: updatedAttributes };
                }
                return p;
            });
            setProductosLocal([...updatedProductos]);
            setMenuOpen({ show: false, product: null, attribute: null, position: { x: 0, y: 0 } });
        } catch (error) {
            console.error("Error al eliminar atributo:", error);
            alert(error.message);
        }
    };

    const handleOpenMenu = (event, product, attribute = null) => {
        event.preventDefault();
        setMenuOpen({
            show: true,
            product,
            attribute,
            position: { x: event.clientX, y: event.clientY }
        });
    };

    const handleCloseMenu = () => {
        setMenuOpen({ show: false, product: null, attribute: null, position: { x: 0, y: 0 } });
    };

    return (
        <div>
            <Navbar />
            <div style={{ position: 'relative' }}>
                <h2 className="tituleInventory">Inventario Segundo Punto</h2>
                <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <ProductActions
                        product={selectedProduct}
                        onAdd={handleAddProduct}
                        onDelete={handleDeleteProduct}
                        onUpdateStock={handleUpdateStock}
                        onSell={handleSellProduct}
                        products={productosLocal}
                        tiendaActual={2} // Pasa 2 para la tienda 2
                    />
                </div>
                {productosLocal && (
                    <ProductsTable
                        productos={currentProducts}
                        onProductSelect={handleProductSelect}
                        onDelete={handleDeleteProduct}
                        onDeleteAttribute={handleDeleteAttribute}
                        onOpenMenu={handleOpenMenu}
                        menuOpen={menuOpen}
                        onCloseMenu={handleCloseMenu}
                    />
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

export default SecondPointInventory;