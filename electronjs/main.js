const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
let data = require("./data.json");

function createWindow() {
    const ventana_princiapl = new BrowserWindow({
        width: 700,
        height: 900,
        webPreferences: { preload: "./preload.js" }
    });
    ventana_princiapl.loadFile('./user/index.html');
}

app.whenReady().then(createWindow);

// Abrir panel admin
ipcMain.on("open-admin", () => {
    const adminWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { preload: "./preload.js" }
    });
    adminWindow.loadFile("./adm/admin.html");
});

// Obtener datos
ipcMain.handle("get-data", () => data);

// Procesar pago
ipcMain.handle("procesar-pago", ({ productoSeleccionado, dineroInsertado }) => {
    let producto = data.productos.find(p => p.codigo === productoSeleccionado);
    if (!producto) return { error: "Producto no encontrado" };
    if (producto.stock <= 0) return { error: "Producto agotado" };
    if (dineroInsertado < producto.precio) return { error: "Dinero insuficiente" };

    const cambio = +(dineroInsertado - producto.precio).toFixed(2);
    const monedas_cambio = calcularCambio(cambio);
    if (!monedas_cambio) return { error: "No se puede dar cambio exacto" };

    producto.stock--;
    agregardinero(dineroInsertado);
    quitardinero(monedas_cambio);
    guardarDatos();

    return { producto, cambio: monedas_cambio };
});

// Calcular cambio
function calcularCambio(cambio) {
    let restante = cambio;
    let monedas_a_devolver = {};
    const monedas_disponibles = [2, 1, 0.5, 0.2, 0.1, 0.05];

    for (let moneda of monedas_disponibles) {
        let cantidad = 0;
        while (restante >= moneda && data.caja.monedas[moneda] > 0) {
            restante = +(restante - moneda).toFixed(2);
            data.caja.monedas[moneda]--;
            cantidad++;
        }
        if (cantidad > 0) monedas_a_devolver[moneda] = cantidad;
    }

    if (restante > 0) {
        for (let m in monedas_a_devolver) data.caja.monedas[m] += monedas_a_devolver[m];
        return null;
    }

    return monedas_a_devolver;
}

// Agregar dinero
function agregardinero(cantidad) {
    const monedas = data.monedasPermitidas;
    for (let moneda of monedas) {
        while (cantidad >= moneda) {
            cantidad = +(cantidad - moneda).toFixed(2);
            data.caja.monedas[moneda]++;
        }
    }
}

// Quitar dinero
function quitardinero(monedas) {
    for (let m in monedas) data.caja.monedas[m] -= monedas[m];
}

// Guardar datos
function guardarDatos() {
    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2), "utf-8");
}

// Admin actualizar
ipcMain.handle("actualizar-datos", (nuevosDatos) => {
    data = nuevosDatos;
    guardarDatos();
    return { exito: true };
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
