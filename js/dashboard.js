import { db } from "./firebase-config.js";

import {
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ventasRef = collection(db,"ventas");
const gastosRef = collection(db,"gastos");
const clientesRef = collection(db,"clientes");
const inventarioRef = collection(db,"inventario");

const ventasHoyEl = document.getElementById("ventasHoy");
const gastosHoyEl = document.getElementById("gastosHoy");
const gananciaHoyEl = document.getElementById("gananciaHoy");
const totalProductosEl = document.getElementById("totalProductos");
const stockBajoEl = document.getElementById("stockBajo");
const totalClientesEl = document.getElementById("totalClientes");

const tablaVentas = document.getElementById("tablaVentas");
const tablaStockBajo = document.getElementById("tablaStockBajo");

function hoy() {

    return new Date().toISOString().split("T")[0];

}

onSnapshot(ventasRef,(snapshot)=>{

    let totalVentas = 0;

    tablaVentas.innerHTML = "";

    const lista = [];

    snapshot.forEach(doc=>{

        const venta = doc.data();

        if(venta.fecha === hoy()){

            totalVentas += Number(venta.monto || 0);

        }

        lista.push(venta);

    });

    lista
    .sort((a,b)=>
        new Date(b.fecha) - new Date(a.fecha)
    )
    .slice(0,10)
    .forEach(v=>{

        tablaVentas.innerHTML += `
            <tr>
                <td>${v.fecha || ""}</td>
                <td>${v.cliente || "General"}</td>
                <td>RD$ ${Number(v.monto || 0).toFixed(2)}</td>
            </tr>
        `;

    });

    ventasHoyEl.textContent =
        `RD$ ${totalVentas.toFixed(2)}`;

    calcularGanancia();

});

onSnapshot(gastosRef,(snapshot)=>{

    let totalGastos = 0;

    snapshot.forEach(doc=>{

        const gasto = doc.data();

        if(gasto.fecha === hoy()){

            totalGastos += Number(gasto.monto || 0);

        }

    });

    gastosHoyEl.textContent =
        `RD$ ${totalGastos.toFixed(2)}`;

    calcularGanancia();

});

function calcularGanancia(){

    const ventas =
        parseFloat(
            ventasHoyEl.textContent
            .replace("RD$","")
            .trim()
        ) || 0;

    const gastos =
        parseFloat(
            gastosHoyEl.textContent
            .replace("RD$","")
            .trim()
        ) || 0;

    gananciaHoyEl.textContent =
        `RD$ ${(ventas-gastos).toFixed(2)}`;

}

onSnapshot(clientesRef,(snapshot)=>{

    totalClientesEl.textContent =
        snapshot.size;

});

onSnapshot(inventarioRef,(snapshot)=>{

    totalProductosEl.textContent =
        snapshot.size;

    let stockBajo = 0;

    tablaStockBajo.innerHTML = "";

    snapshot.forEach(doc=>{

        const p = doc.data();

        if(
            Number(p.cantidad) <=
            Number(p.minimo)
        ){

            stockBajo++;

            tablaStockBajo.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                </tr>
            `;

        }

    });

    stockBajoEl.textContent =
        stockBajo;

});