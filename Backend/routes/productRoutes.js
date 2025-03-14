const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener productos
router.get("/productos", async (req, res) => {
    const storeId = req.query.storeId;
    console.log(`Petición recibida para tienda ID: ${storeId}`);

    try {
        const [productos] = await db.query(`
            SELECT p.*, 
                pa.ID_ATRIBUTO,
                a.NOMBRE_ATRIBUTO, 
                pa.VALOR_ATRIBUTO, 
                pa.CANTIDAD_STOCK,
                p.CANT_DISPONIBLE AS stockGeneral
            FROM producto p
            LEFT JOIN producto_atributo pa ON p.ID_PRODUCTO = pa.ID_PRODUCTO
            LEFT JOIN atributos a ON pa.ID_ATRIBUTO = a.ID_ATRIBUTO
            WHERE p.ID_TIENDA = ?
        `, [storeId]);

        const productosMap = new Map();

        productos.forEach(row => {
            if (!productosMap.has(row.ID_PRODUCTO)) {
                productosMap.set(row.ID_PRODUCTO, {
                    ID_PRODUCTO: row.ID_PRODUCTO,
                    NOMBRE_PRODUCTO: row.NOMBRE_PRODUCTO,
                    DESCRIPCION: row.DESCRIPCION,
                    PRECIO_UNITARIO: row.PRECIO_UNITARIO,
                    CANT_DISPONIBLE: row.CANT_DISPONIBLE,
                    ID_TIENDA: row.ID_TIENDA,
                    atributos: [],
                    stockGeneral: row.stockGeneral
                });
            }
            if (row.ID_ATRIBUTO) {
                productosMap.get(row.ID_PRODUCTO).atributos.push({
                    ID_ATRIBUTO: row.ID_ATRIBUTO,
                    NOMBRE_ATRIBUTO: row.NOMBRE_ATRIBUTO,
                    VALOR_ATRIBUTO: row.VALOR_ATRIBUTO,
                    CANTIDAD_STOCK: row.CANTIDAD_STOCK
                });
            }
        });

        const productosArray = Array.from(productosMap.values());
        console.log("Datos de la API (enviando):", productosArray); // Agregar log antes de enviar la respuesta
        res.json(productosArray);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos: " + error.message }); // Agregar mensaje de error detallado
    }
});

// Agregar un producto
router.post("/productos", async (req, res) => {
    console.log("Datos recibidos:", req.body);
    console.log("Tipo de dato de tiendaId:", typeof req.body.tiendaId); // Agregar log para el tipo de dato
    console.log("Tienda ID recibido:", req.body.tiendaId); // Agregar log para el valor

    const { nombre, descripcion, precio, stock, tiendaId, atributos } = req.body;

    if (!nombre || !precio || !tiendaId) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const [result] = await db.query(`
            INSERT INTO producto (NOMBRE_PRODUCTO, DESCRIPCION, PRECIO_UNITARIO, CANT_DISPONIBLE, ID_TIENDA) 
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio, stock !== null ? stock : 0, tiendaId]
        );

        const productId = result.insertId;

        if (atributos && atributos.length > 0) {
            for (const attr of atributos) {
                const [existingAttr] = await db.query(
                    "SELECT ID_ATRIBUTO FROM atributos WHERE NOMBRE_ATRIBUTO = ?",
                    [attr.nombre]
                );

                let atributoId = existingAttr.length ? existingAttr[0].ID_ATRIBUTO : null;

                if (!atributoId) {
                    const [newAttr] = await db.query(
                        "INSERT INTO atributos (NOMBRE_ATRIBUTO) VALUES (?)",
                        [attr.nombre]
                    );
                    atributoId = newAttr.insertId;
                }

                await db.query(
                    "INSERT INTO producto_atributo (ID_PRODUCTO, ID_ATRIBUTO, VALOR_ATRIBUTO, CANTIDAD_STOCK) VALUES (?, ?, ?, ?)",
                    [productId, atributoId, attr.valor, attr.stock]
                );
            }
        }

        res.json({ message: "Producto agregado correctamente", id: productId });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// Eliminar un producto
router.delete("/productos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM producto WHERE ID_PRODUCTO = ?", [id]);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

// Actualizar stock de un producto
router.put("/productos/:id/stock", async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
        return res.status(400).json({ error: "Stock es requerido" });
    }

    try {
        await db.query("UPDATE producto SET CANT_DISPONIBLE = ? WHERE ID_PRODUCTO = ?", [stock, id]);
        res.json({ message: "Stock actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar stock:", error);
        res.status(500).json({ error: "Error al actualizar stock" });
    }
});

// Registrar una venta
router.post("/ventas", async (req, res) => {
    const { productoId, atributoId, cantidad, precioVenta } = req.body;

    if (!productoId || !cantidad || !precioVenta) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        if (atributoId) {
            await db.query(
                "UPDATE producto_atributo SET CANTIDAD_STOCK = CANTIDAD_STOCK - ? WHERE ID_PRODUCTO = ? AND ID_ATRIBUTO = ?",
                [cantidad, productoId, atributoId]
            );
        } else {
            await db.query(
                "UPDATE producto SET CANT_DISPONIBLE = CANT_DISPONIBLE - ? WHERE ID_PRODUCTO = ?",
                [cantidad, productoId]
            );
        }

        await db.query(
            "INSERT INTO ventas (ID_PRODUCTO, ID_ATRIBUTO, CANTIDAD, PRECIO_VENTA, FECHA_VENTA) VALUES (?, ?, ?, ?, NOW())",
            [productoId, atributoId || null, cantidad, precioVenta]
        );

        res.json({ message: "Venta registrada correctamente" });
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
});

// Obtener atributos
router.get("/atributos", async (req, res) => {
    try {
        const [atributos] = await db.query("SELECT * FROM atributos");
        res.json(atributos);
    } catch (error) {
        console.error("Error al obtener atributos:", error);
        res.status(500).json({ error: "Error al obtener atributos" });
    }
});

// Eliminar un atributo
router.delete("/productos/:productoId/atributos/:valorAtributo", async (req, res) => {
    try {
        const { productoId, valorAtributo } = req.params;
        const decodedValorAtributo = decodeURIComponent(valorAtributo); // Decodificar el valor del atributo

        console.log("Producto ID recibido:", productoId);
        console.log("Valor atributo recibido:", decodedValorAtributo);

        // Eliminar el atributo de la base de datos
        const [result] = await db.query(
            "DELETE FROM producto_atributo WHERE ID_PRODUCTO = ? AND VALOR_ATRIBUTO = ?",
            [productoId, decodedValorAtributo]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Atributo no encontrado' });
        }

        res.json({ mensaje: 'Atributo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar atributo:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;