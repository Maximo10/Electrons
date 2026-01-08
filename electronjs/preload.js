const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    // Abrir ventana admin
    openAdmin: () => ipcRenderer.send("open-admin"),

    // Obtener datos (productos, monedas, billetes)
    getData: () => ipcRenderer.invoke("get-data"),

    // Realizar pago
    pagar: (productoSeleccionado, dineroInsertado) => ipcRenderer.invoke("preocear-pago", productoSeleccionado, dineroInsertado),

    // Actualizar datos desde admin
    actualizar: (nuevosDatos) => ipcRenderer.invoke("actualizar-datos", nuevosDatos)
});
