//---------------------------------------------------------------//

let productosMujer = [];

//---------------------------------------------------------------//

fetch("../assets/data/mujer.json")
    .then(response => response.json())
    .then(data => {
        productosMujer = data;
        cargarProductos(productosMujer);
    })

//- ELEMENTOS DEL DOM -//

const contenedorProductosMujer = document.querySelector("#mujer__contenedor-productos")

let botonesAgregar = document.querySelectorAll(".producto-agregar")
let botonesAgregarDeseos = document.querySelectorAll(".producto-deseo")
const numeritoCarrito = document.querySelector("#numerito-carrito")
const numeritoDeseo = document.querySelector("#numerito-deseo")

//---------------------------------------------------------------//

function cargarProductos(productosElegidos){

    contenedorProductosMujer.innerHTML = "";

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

        contenedorProductosMujer.append(div);
    })

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

function agregarAlCarrito (e) {

    Toastify({
        text: "Producto agregado al Carrito",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            },

            onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregadoAlCarrito = productosMujer.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregadoAlCarrito.cantidad = 1;
        productosEnCarrito.push(productoAgregadoAlCarrito);
    }

    ActualizarCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
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
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            },

            onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregadoADeseos = productosMujer.find(producto => producto.id === idBoton);

    if(productosEnDeseos.some(producto => producto.id === idBoton)) {
        const index = productosEnDeseos.findIndex(producto => producto.id === idBoton);
        productosEnDeseos[index].cantidad++;
    } else {
        productoAgregadoADeseos.cantidad = 1;
        productosEnDeseos.push(productoAgregadoADeseos);
    }

    ActualizarListaDeDeseos();

    localStorage.setItem("productos-en-lista-de-deseos", JSON.stringify(productosEnDeseos));
}

//---------------------------------------------------------------//

function ActualizarListaDeDeseos() {
    let nuevoNumeritoDeseo = productosEnDeseos.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeritoDeseo.innerText = nuevoNumeritoDeseo;
}