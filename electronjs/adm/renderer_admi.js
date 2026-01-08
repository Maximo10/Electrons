let data;

window.addEventListener("DOMContentLoaded", async () => {
    data = await window.api.getData();
    cargarProductos();

    document.getElementById("guardar-prod").onclick = () => {
        const codigo = document.getElementById("codigo").value;
        const nombre = document.getElementById("nombre").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value);

        let prod = data.productos.find(p => p.codigo === codigo);
        if (prod) { prod.nombre = nombre; prod.precio = precio; prod.stock = stock; }
        else data.productos.push({ codigo, nombre, precio, stock });

        window.api.actualizar(data);
        cargarProductos();
        alert("Producto guardado");
    };
});

function cargarProductos() {
    const lista = document.querySelector(".grid-productos");
    lista.innerHTML = "";
    data.productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <img src="image.png" alt="${producto.nombre}">
            <div class="info">
                <span class="nombre">${producto.nombre}</span>
                <span class="precio">€${producto.precio.toFixed(2)}</span>
                <span class="stock">Stock: ${producto.stock}</span>
            </div>
        `;
        lista.appendChild(div);
    });
}
