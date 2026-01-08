let codigo = "";
let dinero = 0;
let precios = {}; // Guardamos los precios de productos

window.addEventListener("DOMContentLoaded", async () => {
    const data = await window.api.getData();

    // Guardamos los precios
    data.productos.forEach(produ => {
        precios[produ.codigo] = produ.precio;
    });

    // Botones de letras
    document.querySelectorAll(".let_botones button").forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.textContent;
            if (codigo.length < 2) codigo += val;
            actualizarPantalla();
        });
    });

    // Botones de números (excepto aceptar y borrar)
    document.querySelectorAll(".num_botones button").forEach(btn => {
        const val = btn.textContent;
        if (val !== "Acep" && val !== "->") {
            btn.addEventListener("click", () => {
                if (codigo.length < 2) codigo += val;
                actualizarPantalla();
            });
        }
    });

    // Botón aceptar
    document.getElementById("Acep").onclick = comprar;

    // Botón borrar
    document.getElementById("Devo").onclick = () => {
        codigo = "";
        actualizarPantalla();
    };

    // Botones dinero (IDs únicos)
    const botonesDinero = ["mone_005","mone_010","mone_020","mone_050","mone_1","mone_2",
                           "bill_5","bill_10","bill_20"];
    botonesDinero.forEach(id => {
        document.getElementById(id).onclick = () => {
            let val = parseFloat(document.getElementById(id).textContent.replace("€",""));
            dinero += val;
            actualizarPantalla();
        };
    });

    // Botón devolver
    document.querySelector(".debol button").onclick = () => {
        alert(`Se devuelve: ${dinero.toFixed(2)}€`);
        dinero = 0;
        actualizarPantalla();
    };

    // Botón admin
    document.querySelector(".admin button").onclick = () => {
        window.api.openAdmin();
    };
});

function actualizarPantalla() {
    const pantalla = document.querySelector(".pantalla");
    if (!codigo) {
        pantalla.textContent = `Ingrese producto | Dinero: ${dinero.toFixed(2)}€`;
        return;
    }

    let texto = `Código: ${codigo}`;
    if (precios[codigo] !== undefined) texto += ` | Precio: ${precios[codigo]}€`;
    texto += ` | Dinero: ${dinero.toFixed(2)}€`;

    pantalla.textContent = texto;
}

// Comprar producto
async function comprar() {
    if (codigo.length !== 2 || precios[codigo] === undefined) {
        alert("Código inválido");
        return;
    }

    const res = await window.api.pagar({
        productoSeleccionado: codigo,
        dineroInsertado: dinero
    });

    if (res.error) {
        alert(res.error);
        return;
    } else {
        alert(`Producto: ${res.producto.nombre}\nCambio: ${JSON.stringify(res.cambio)}`);
        codigo = "";
        dinero = 0;
        actualizarPantalla();
    }
}
