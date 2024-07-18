//---------------------------------------------------------------//

let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//- ELEMENTOS DEL DOM -//

const carritoVacio = document.querySelector("#carrito__carrito-vacio");
const carritoProductos = document.querySelector("#carrito__carrito-productos");
const carritoAcciones = document.querySelector("#carrito__carrito-acciones");
const carritoComprado = document.querySelector("#carrito__carrito-comprado");
let eliminar = document.querySelectorAll(".carrito__carrito-producto-eliminar");
const vaciar = document.querySelector("#carrito__carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#carrito__total");
const comprar = document.querySelector("#carrito__carrito-acciones-comprar");

//---------------------------------------------------------------//

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        carritoVacio.classList.add("disabled");
        carritoProductos.classList.remove("disabled");
        carritoAcciones.classList.remove("disabled");
        carritoComprado.classList.add("disabled");
    
        carritoProductos.innerHTML = "";
        
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito__carrito-producto");
            div.innerHTML = `
                <img class="carrito__carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito__carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito__carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito__carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito__carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito__carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            carritoProductos.append(div);
        });

        actualizarBotonEliminar();
        actualizarTotal();
    
    } else {
    
        carritoVacio.classList.remove("disabled");

        carritoProductos.classList.add("disabled");
        carritoProductos.classList.remove("carrito__carrito-productos");

        carritoAcciones.classList.remove("carrito__carrito-acciones");
        carritoAcciones.classList.add("disabled");

        carritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

//---------------------------------------------------------------//

function actualizarBotonEliminar() {
    eliminar = document.querySelectorAll(".carrito__carrito-producto-eliminar");

    eliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    })
}

//---------------------------------------------------------------//

function eliminarDelCarrito(e){

    Toastify({
        text: "Producto eliminado",
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

    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();
    
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//---------------------------------------------------------------//

vaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: "¿Estas seguro?",
        icon: "question",
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Si`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {

            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

//---------------------------------------------------------------//

function actualizarTotal(){
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)
    carrito__total.innerText = `$ ${totalCalculado}`;
}

//---------------------------------------------------------------//

comprar.addEventListener("click", async () => {
    const confirmacionCompra = await Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Usted va a comprar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacionCompra.isConfirmed) {
        const { value: formValues } = await Swal.fire({
            title: 'Información de Compra',
            html:
                '<input type="radio" name="metodoPago" value="tarjeta"> Tarjeta de Crédito/Débito<br>' +
                '<input type="radio" name="metodoPago" value="paypal"> PayPal<br>' +
                '<input type="radio" name="metodoPago" value="transferencia"> Transferencia Bancaria<br>' +
                '<input id="swal-input2" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input3" class="swal2-input" placeholder="Apellido">' +
                '<input id="swal-input4" class="swal2-input" placeholder="Correo Electrónico">' +
                '<input id="swal-input5" class="swal2-input" placeholder="Número de Teléfono">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.querySelector('input[name="metodoPago"]:checked').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value,
                    document.getElementById('swal-input5').value
                ];
            }
        });

        if (formValues) {
            const [metodoPago, nombre, apellido, email, telefono] = formValues;

            const informacionCompra = {
                metodoPago,
                nombre,
                apellido,
                email,
                telefono
            };

            localStorage.setItem("informacion-compra", JSON.stringify(informacionCompra));

            Swal.fire({
                title: 'Compra realizada con éxito',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            carritoVacio.classList.remove("disabled");
            carritoProductos.classList.add("disabled");
            carritoProductos.classList.remove("carrito__carrito-productos");
            carritoAcciones.classList.remove("carrito__carrito-acciones");
            carritoAcciones.classList.add("disabled");
            carritoComprado.classList.add("disabled");
        }
    }
});
