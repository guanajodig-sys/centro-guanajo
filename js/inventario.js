import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

window.editarProducto = async function(id){

    try{

        const docRef = doc(db, "caja", id);

        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){

            alert("Producto no encontrado");
            return;

        }

        const producto = docSnap.data();

        document.getElementById("productoId").value = id;

        document.getElementById("codigo").value =
        producto.codigo || "";

        document.getElementById("nombre").value =
            producto.nombre || "";

        document.getElementById("categoria").value =
            producto.categoria || "";

        document.getElementById("cantidad").value =
            producto.cantidad || 0;

        document.getElementById("costo").value =
            producto.costo || 0;

        document.getElementById("precioVenta").value =
            producto.precioVenta || 0;

        document.getElementById("minimo").value =
            producto.minimo || 0;

        modal.style.display = "flex";

    }catch(error){

        console.error(error);

        alert("Error al cargar producto");

    }

}

const tabla = document.getElementById("tablaInventario");

const modal = document.getElementById("modalProducto");

const productosRef = collection(db, "caja");

document
.getElementById("btnNuevoProducto")
.addEventListener("click", () => {

    limpiarFormulario();

    modal.style.display = "flex";

});

document
.getElementById("cerrarModal")
.addEventListener("click", () => {

    modal.style.display = "none";

});

document
.getElementById("guardarProducto")
.addEventListener("click", guardarProducto);

async function guardarProducto(){

    const id = document.getElementById("productoId").value;

    const data = {

    codigo:
    document.getElementById("codigo")?.value ||
    `PROD-${Date.now()}`,

    nombre:
    document.getElementById("nombre").value.trim(),

    categoria:
    document.getElementById("categoria").value.trim(),

    cantidad:
    Number(document.getElementById("cantidad").value),

    costo:
    Number(document.getElementById("costo").value),

    precioVenta:
    Number(document.getElementById("precioVenta").value),

    minimo:
    Number(document.getElementById("minimo").value)

};

if(!data.nombre){

    alert("Debe indicar el nombre del producto");
    return;

}

if(data.precioVenta <= 0){

    alert("Precio de venta inválido");
    return;

}

    try{

        if(id){

            await updateDoc(
                doc(db,"caja",id),
                data
            );

        }else{

            await addDoc(
                productosRef,
                data
            );

        }

        modal.style.display = "none";

    }catch(error){

        console.error(error);

        alert("Error al guardar");

    }
}

function cargarInventario(){

    onSnapshot(productosRef,(snapshot)=>{

        tabla.innerHTML="";

        snapshot.forEach((documento)=>{

            const producto=documento.data();

            const tr=document.createElement("tr");

            let estado =
                producto.cantidad <= producto.minimo
                ? "<span class='stock-bajo'>Bajo</span>"
                : "<span class='stock-ok'>OK</span>";

            tr.innerHTML=`

                <td>${producto.nombre}</td>

                <td>${producto.categoria}</td>

                <td>${producto.cantidad}</td>

                <td>${producto.costo}</td>

                <td>${producto.precioVenta}</td>

                <td>${estado}</td>

                <td>

                    <button
                        onclick="editarProducto(
                        '${documento.id}')">

                        Editar

                    </button>

                    <button
                        onclick="eliminarProducto(
                        '${documento.id}')">

                        Eliminar

                    </button>

                </td>
            `;

            tabla.appendChild(tr);

        });

    });

}

window.eliminarProducto = async function(id){

    if(confirm("¿Eliminar producto?")){

        await deleteDoc(
            doc(db,"caja",id)
        );

    }

}

function limpiarFormulario(){

    document.getElementById("codigo").value = "";
    
    document.getElementById("productoId").value="";

    document.getElementById("nombre").value="";

    document.getElementById("categoria").value="";

    document.getElementById("cantidad").value="";

    document.getElementById("costo").value="";

    document.getElementById("precioVenta").value="";

    document.getElementById("minimo").value="";

}

cargarInventario();

const buscarProducto =
document.getElementById("buscarProducto");

buscarProducto.addEventListener("input", () => {

    const texto =
        buscarProducto.value.toLowerCase();

    const filas =
        document.querySelectorAll(
            "#tablaInventario tr"
        );

    filas.forEach(fila => {

        const contenido =
            fila.textContent.toLowerCase();

        fila.style.display =
            contenido.includes(texto)
            ? ""
            : "none";

    });

});