const contenedor =
document.getElementById("contenidoModulo");

document
.querySelectorAll(".menu-item")
.forEach(boton => {

    boton.addEventListener(
        "click",
        async () => {

            const vista =
            boton.dataset.view;

            try{

                const response =
                await fetch(vista);

                const html =
                await response.text();

                contenedor.innerHTML =
                html;

                cargarCSS(vista);
                cargarScript(vista);

            }catch(error){

                console.error(error);

                contenedor.innerHTML = `
                <h2>Error al cargar módulo</h2>
                `;

            }

        }
    );

});

function cargarScript(vista){

    document
    .querySelectorAll(
        "script[data-modulo]"
    )
    .forEach(s=>s.remove());

    let archivo = "";

    if(vista.includes("inventario")){

        archivo =
        "../js/inventario.js";

    }

    if(vista.includes("caja")){

        archivo =
        "../js/caja.js";

    }

    if(vista.includes("clientes")){

        archivo =
        "../js/clientes.js";

    }

    if(vista.includes("usuarios")){

        archivo =
        "../js/usuarios.js";

    }

    if(vista.includes("servicios")){

        archivo =
        "../js/servicios.js";

    }

    if(vista.includes("ventas")){

        archivo =
        "../js/ventas.js";

    }

    if(vista.includes("dashboard")){

        archivo =
        "../js/dashboard.js";

    }

    if(!archivo) return;

    const script =
    document.createElement("script");

    script.type = "module";

    script.src = archivo;

    script.dataset.modulo = true;

    document.body.appendChild(script);

}

function cargarCSS(vista){

    const cssActual =
    document.getElementById("css-modulo");

    if(cssActual){

        cssActual.remove();

    }

    let archivo = "";

    if(vista.includes("inventario")){

        archivo =
        "../css/inventario.css";

    }

    if(vista.includes("caja")){

        archivo =
        "../css/caja.css";

    }

    if(!archivo) return;

    const link =
    document.createElement("link");

    link.rel = "stylesheet";

    link.href = archivo;

    link.id = "css-modulo";

    document.head.appendChild(link);

}