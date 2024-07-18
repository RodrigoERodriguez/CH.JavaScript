//---------------------------------------------------------------//

let productosEnDeseos = localStorage.getItem("productos-en-lista-de-deseos");
productosEnDeseos = JSON.parse(productosEnDeseos);

//- ELEMENTOS DEL DOM -//

const deseosVacio = document.querySelector("#deseos__deseos-vacio");
const deseosProductos = document.querySelector("#deseos__deseos-productos");
const deseosAcciones = document.querySelector("#deseos__deseos-acciones");
let eliminar = document.querySelectorAll(".deseos__deseos-producto-eliminar");
const vaciar = document.querySelector("#deseos__deseos-acciones-vaciar");
const total = document.querySelector("#deseos__total");

//---------------------------------------------------------------//

function cargarProductosDeseos() {
    if (productosEnDeseos && productosEnDeseos.length > 0) {

        deseosVacio.classList.add("disabled");
        deseosProductos.classList.remove("disabled");
        deseosAcciones.classList.remove("disabled");
    
        deseosProductos.innerHTML = "";
        
        productosEnDeseos.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("deseos__deseos-producto");
            div.innerHTML = `
                <img class="deseos__deseos-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="deseos__deseos-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="deseos__deseos-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="deseos__deseos-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="deseos__deseos-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="deseos__deseos-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            deseosProductos.append(div);
        });

        actualizarBotonEliminar();
        actualizarTotal();
    
    } else {

        deseosVacio.classList.remove("disabled");
        
        deseosProductos.classList.add("disabled");
        deseosProductos.classList.remove("deseos__deseos-productos");

        deseosAcciones.classList.remove("deseos__deseos-acciones");
        deseosAcciones.classList.add("disabled");

    }
}

cargarProductosDeseos();

//---------------------------------------------------------------//

function actualizarBotonEliminar() {
    eliminar = document.querySelectorAll(".deseos__deseos-producto-eliminar");

    eliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelDeseos);
    })
}

//---------------------------------------------------------------//

function eliminarDelDeseos(e){

    Toastify({
        text: "Producto eliminado",
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
            onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnDeseos.findIndex(producto => producto.id === idBoton);

    productosEnDeseos.splice(index, 1);
    cargarProductosDeseos();
    
    localStorage.setItem("productos-en-lista-de-deseos", JSON.stringify(productosEnDeseos));
}

//---------------------------------------------------------------//

vaciar.addEventListener("click", vaciarLista);
function vaciarLista() {

    Swal.fire({
        title: "¿Estas seguro?",
        icon: "question",
        html: `Se van a borrar ${productosEnDeseos.reduce((acc, producto) => acc + producto.cantidad, 0)} productos`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Si`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {

            productosEnDeseos.length = 0;
            localStorage.setItem("productos-en-lista-de-deseos", JSON.stringify(productosEnDeseos));
            cargarProductosDeseos();
        }
    });
}

//---------------------------------------------------------------//

function actualizarTotal(){
    const totalCalculado = productosEnDeseos.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)
    deseos__total.innerText = `$ ${totalCalculado}`;
}