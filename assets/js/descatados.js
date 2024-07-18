let productos = {
    ingresos: [],
    hombre: [],
    mujer: [],
    infancia: [],
    hogar: [],
};

const contenedorProductosIngresos = document.querySelector("#main__contenedor-ingresos");
const contenedorProductosHombre = document.querySelector("#main__contenedor-hombre");
const contenedorProductosMujer = document.querySelector("#main__contenedor-mujer");
const contenedorProductosInfancia = document.querySelector("#main__contenedor-infancia");
const contenedorProductosHogar = document.querySelector("#main__contenedor-hogar");
const numeritoCarrito = document.querySelector("#numerito-carrito")
const numeritoDeseo = document.querySelector("#numerito-deseo")

fetch("../assets/data/destacados.json")
    .then(response => response.json())
    .then(data => {
        productos.ingresos = data.ingresos;
        productos.hombre = data.hombre;
        productos.mujer = data.mujer;
        productos.infancia = data.infancia;
        productos.hogar = data.hogar;

        cargarProductos(productos.ingresos, contenedorProductosIngresos);
        cargarProductos(productos.hombre, contenedorProductosHombre);
        cargarProductos(productos.mujer, contenedorProductosMujer);
        cargarProductos(productos.infancia, contenedorProductosInfancia);
        cargarProductos(productos.hogar, contenedorProductosHogar);});

function cargarProductos(productosElegidos, contenedor) {
    contenedor.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="categoria__producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="categoria__producto-detalles">
                <h3 class="categoria__producto-titulo">${producto.titulo}</h3>
                <p class="categoria__producto-precio">$ ${producto.precio}</p>
                
                <div class="categoria__botones">
                    <button class="categoria__producto-carrito" id="${producto.id}">AGREGAR</button>
                    <button class="categoria__producto-deseo" id="${producto.id}"><i class="bi bi-heart"></i></button>
                </div>
            </div>
        `;

        contenedor.appendChild(div);
    });

    actualizarBotonAgregar();
    actualizarBotonAgregarDeseos();
}

//- FUNCIONALIDADES DE BOTONES -//

function actualizarBotonAgregar () {
    botonesAgregar = document.querySelectorAll(".categoria__producto-carrito")

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })
}

function actualizarBotonAgregarDeseos () {
    botonesAgregarDeseos = document.querySelectorAll(".categoria__producto-deseo")

    botonesAgregarDeseos.forEach(boton => {
        boton.addEventListener("click", agregarListaDeDeseos);
    })
}

//---------------------------------------------------------------//
let productosEnCarrito;
let productosEnDeseos;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
let productosEnListaDeDeseosLS = localStorage.getItem("productos-en-lista-de-deseos");

//---------------------------------------------------------------//

if(productosEnCarritoLS){

    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    ActualizarCarrito();

} else {
    productosEnCarrito = [];
}

if(productosEnListaDeDeseosLS){

    productosEnDeseos = JSON.parse(productosEnListaDeDeseosLS);
    ActualizarListaDeDeseos();

} else {
    productosEnDeseos = [];
}

//---------------------------------------------------------------//
function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado al Carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "0.75rem",
        },
        onClick: function () {},
    }).showToast();

    const idBoton = e.currentTarget.id;

    const productoAgregadoAlCarrito = Object.values(productos)
        .flat()
        .find((producto) => producto.id === idBoton);

    if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(
            (producto) => producto.id === idBoton
        );
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregadoAlCarrito.cantidad = 1;
        productosEnCarrito.push(productoAgregadoAlCarrito);
    }

    ActualizarCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)
    );
}

//---------------------------------------------------------------//

function ActualizarCarrito() {
    let nuevoNumeritoCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeritoCarrito.innerText = nuevoNumeritoCarrito;
}

//---------------------------------------------------------------//

function agregarListaDeDeseos(e) {
    Toastify({
        text: "Producto agregado a Favoritos",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "0.75rem",
        },
        onClick: function () {},
    }).showToast();

    const idBoton = e.currentTarget.id;

    const productosAplanados = Object.values(productos).flat();
    const productoAgregadoADeseos = productosAplanados.find(
        (producto) => producto.id === idBoton
    );

    if (!productoAgregadoADeseos) {
        console.error("Producto no encontrado.");
        return;
    }

    if (productosEnDeseos.some((producto) => producto.id === idBoton)) {
        const index = productosEnDeseos.findIndex(
            (producto) => producto.id === idBoton
        );
        productosEnDeseos[index].cantidad++;
    } else {
        productoAgregadoADeseos.cantidad = 1;
        productosEnDeseos.push(productoAgregadoADeseos);
    }

    ActualizarListaDeDeseos();

    localStorage.setItem(
        "productos-en-lista-de-deseos",
        JSON.stringify(productosEnDeseos)
    );
}

//---------------------------------------------------------------//

function ActualizarListaDeDeseos() {
    let nuevoNumeritoDeseo = productosEnDeseos.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeritoDeseo.innerText = nuevoNumeritoDeseo;
}