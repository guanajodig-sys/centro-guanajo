import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const cajaRef = collection(db, "movimientosCaja");

const tablaCaja = document.getElementById("tablaCaja");

const totalIngresos =
document.getElementById("totalIngresos");

const totalGastos =
document.getElementById("totalGastos");

const balanceCaja =
document.getElementById("balanceCaja");

const modal =
document.getElementById("modalMovimiento");

const buscarMovimiento =
document.getElementById("buscarMovimiento");

document
.getElementById("btnNuevoIngreso")
.addEventListener("click", () => {

    limpiarFormulario();

    document.getElementById("tipoMovimiento").value =
    "INGRESO";

    document.getElementById("tituloModal").textContent =
    "Nuevo Ingreso";

    modal.style.display = "flex";

});

document
.getElementById("btnNuevoGasto")
.addEventListener("click", () => {

    limpiarFormulario();

    document.getElementById("tipoMovimiento").value =
    "GASTO";

    document.getElementById("tituloModal").textContent =
    "Nuevo Gasto";

    modal.style.display = "flex";

});

document
.getElementById("cerrarModal")
.addEventListener("click", () => {

    modal.style.display = "none";

});

document
.getElementById("guardarMovimiento")
.addEventListener("click", guardarMovimiento);

async function guardarMovimiento(){

    const id =
    document.getElementById("movimientoId").value;

    const data = {

        fecha:
        new Date()
        .toISOString()
        .split("T")[0],

        tipo:
        document.getElementById("tipoMovimiento").value,

        concepto:
        document.getElementById("concepto").value.trim(),

        monto:
        Number(
            document.getElementById("monto").value
        )

    };

    if(!data.concepto){

        alert("Debe escribir un concepto");
        return;

    }

    if(data.monto <= 0){

        alert("Monto inválido");
        return;

    }

    try{

        if(id){

            await updateDoc(
                doc(db,"movimientosCaja",id),
                data
            );

        }else{

            await addDoc(
                cajaRef,
                data
            );

        }

        modal.style.display = "none";

    }catch(error){

        console.error(error);

        alert("Error al guardar");

    }

}

function cargarCaja(){

    onSnapshot(cajaRef,(snapshot)=>{

        tablaCaja.innerHTML = "";

        let ingresos = 0;
        let gastos = 0;

        snapshot.forEach((documento)=>{

            const mov = documento.data();

            if(mov.tipo === "INGRESO"){

                ingresos += Number(mov.monto);

            }else{

                gastos += Number(mov.monto);

            }

            const tr =
            document.createElement("tr");

            tr.innerHTML = `

                <td>${mov.fecha || ""}</td>

                <td>${mov.tipo || ""}</td>

                <td>${mov.concepto || ""}</td>

                <td>
                    RD$ ${Number(mov.monto || 0)
                    .toFixed(2)}
                </td>

                <td>

                    <button
                    onclick="editarMovimiento(
                    '${documento.id}')">

                    Editar

                    </button>

                    <button
                    onclick="eliminarMovimiento(
                    '${documento.id}')">

                    Eliminar

                    </button>

                </td>

            `;

            tablaCaja.appendChild(tr);

        });

        totalIngresos.textContent =
        `RD$ ${ingresos.toFixed(2)}`;

        totalGastos.textContent =
        `RD$ ${gastos.toFixed(2)}`;

        balanceCaja.textContent =
        `RD$ ${(ingresos-gastos).toFixed(2)}`;

    });

}

window.editarMovimiento =
async function(id){

    try{

        const docRef =
        doc(db,"movimientosCaja",id);

        const docSnap =
        await getDoc(docRef);

        if(!docSnap.exists()){

            alert("No encontrado");
            return;

        }

        const mov = docSnap.data();

        document
        .getElementById("movimientoId")
        .value = id;

        document
        .getElementById("tipoMovimiento")
        .value = mov.tipo;

        document
        .getElementById("concepto")
        .value = mov.concepto;

        document
        .getElementById("monto")
        .value = mov.monto;

        document
        .getElementById("tituloModal")
        .textContent = "Editar Movimiento";

        modal.style.display = "flex";

    }catch(error){

        console.error(error);

    }

}

window.eliminarMovimiento =
async function(id){

    if(!confirm(
        "¿Eliminar movimiento?"
    )) return;

    try{

        await deleteDoc(
            doc(
                db,
                "movimientosCaja",
                id
            )
        );

    }catch(error){

        console.error(error);

    }

}

function limpiarFormulario(){

    document
    .getElementById("movimientoId")
    .value = "";

    document
    .getElementById("concepto")
    .value = "";

    document
    .getElementById("monto")
    .value = "";

}

buscarMovimiento.addEventListener(
"input",
() => {

    const texto =
    buscarMovimiento.value.toLowerCase();

    const filas =
    document.querySelectorAll(
        "#tablaCaja tr"
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

cargarCaja();