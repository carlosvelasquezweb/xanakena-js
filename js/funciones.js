
/* Arreglo Principal
---------------------------*/
let dataBase = [];

/* Creación del Constructor
---------------------------*/
class Prestamo {
    constructor(data) {
        this.nombre = data[0].toUpperCase();
        this.monto = Number(data[1]);
        this.cuotas = Number(data[2]).toFixed(2);
        this.iva = 1.21;
        this.calcular = () => {

            //Declaramos las variables que vamos a usar

            let porcentaje, recargo, intereses, totalCuotas, totalPrestamo;

            //La propiedad Cuotas entra en los condicionales y ddependiendo de la cantidad de cuotas realizara un calculo especifico

            if (this.cuotas > 0 && this.cuotas <= 3) {
                recargo = 0.03148 + this.iva;
            } else if (cuotas > 3 && cuotas <= 6) {
                recargo = 0.0601 + this.iva;
            } else if (cuotas > 6 && cuotas <= 12) {
                recargo = 1.1148 + this.iva;
            } else if (cuotas > 12 && cuotas <= 24) {
                recargo = 1.2652 + this.iva;
            } else if (cuotas > 24 && cuotas <= 48) {
                recargo = 1.3652 + this.iva;
            }
            porcentaje = this.monto * recargo;
            intereses = this.monto * recargo - this.monto;
            totalCuotas = porcentaje / this.cuotas;
            totalPrestamo = totalCuotas * this.cuotas;



            //Una vez realizado el calculo el resultado se almacenara en Local Storage, como un array de nombre 'Cotización' y cada uno de los valores representara la posición en la cual está.
            localStorage.setItem('cotizacion', JSON.stringify([this.nombre, this.monto.toFixed(2), this.cuotas, intereses.toFixed(2), totalCuotas.toFixed(2), totalPrestamo.toFixed(2)]));
        };
    }
}

/* 
   ProcesarDatos:
   # Se encarga de tomar los valores del Local Storage y pasarlos al objeto, una vez ahí,
   # Se invoca al metodo 'Calcular', se crea la estructura de la tabla y se muestran los datos al usuario 
-------------------------------------------------------------------------------------------------------------*/
function procesarDatos() {
    $('#formulario').fadeOut(500);
    //Variable que recoge los datos del Local Storafe;
    const data = JSON.parse(localStorage.getItem('datos'));

    //Se crea un nuevo objeto de tipo Prestamo y le pasamos los valores recopilados en el Local Storage 'data'
    const prestamo = new Prestamo(data);

    //Llama al metodo calcular y hace la cotización del prestamo la cual se almacena en Local Storage 'Cotizacion'
    prestamo.calcular();

    //Se crea la estructura de la tabla principal
    crearEstructura();


    //Sacamos los datos de Local Storage
    const cotizado = JSON.parse(localStorage.getItem('cotizacion'));

    //Ingresamos los  datos calculados en nuestro array de objetos 'dataBase' para ir almacenando todos los calculos. 
    dataBase.push(cotizado);

    //En el cuerpo de la tabla generada por la función 'CrearEstructura()' Creamos un elemento de fila
    let fila = document.createElement('tr');
    document.querySelector('#cuerpo').appendChild(fila);

    //Muestra el resultado en celdas las cuales iran apareciendo en orden una tras otra en el elemento fila
    for (let x of cotizado) {
        let item = document.createElement('td');
        item.innerHTML = x;
        fila.appendChild(item);
    }

    //Generamos el botón volver para regresar y realizar nuevas cotizaciones
    botonVolver();


}

/* Variables:
- Se usaran en la función 'capturaDatos' para capturar los valores de los inputs
- Se usaran en la función 'borrarDatos' para borrar los campos de los inputs
---------------------------*/
let nombre, monto, cuotas;


/* Función para notificar cualquier error o mensaje del sistema
- Crea la estructura de la notificación y recibe por parametros el mensaje que se desea mostrar
- El mensaje cambia segun el caso
---------------------------*/
function alerta(mensaje) {
    return $('#notification').html(`
        <div class="notification-content">
        <div><em>${mensaje}</em></div>
        <div id="cerrar">Cerrar X</div>
        </div>
`);
}


/* Función para Cargar datos
--------------------------*/
function capturaDatos() {

    //Capturamos el valor de los inputs y el select, usando JQuery y val()
    nombre = $('#nombreInput').val();
    monto = $('#montoInput').val();
    cuotas = $('#cuotasInput').val();

    //Condiciónes si los campos no cumplen con las condiciones del formulario. 
    if ((nombre === '') || (nombre.length < 3)) {
        let mensaje = 'El campo nombre está vacio!';
        alerta(mensaje);
        cerrarAlert();
        return false;
    }
    if ((monto === '') || (monto < 10000)) {
        let mensaje = 'El monto del prestamo debe ser superior a $10.000 pesos';
        alerta(mensaje);
        cerrarAlert();
        return false;
    }
    if (cuotas === '') {
        let mensaje = 'No ha seleccionado las cuotas de su prestamo!';
        alerta(mensaje);
        cerrarAlert();
        return false;
    }


    localStorage.setItem('datos', JSON.stringify([nombre, monto, cuotas]));

    //Llamamos a la función: 
    procesarDatos();

}

/* 
    Crea la estructura principal de la tabla para mostrar los resultados
-------------------------------------------------------------------------*/
function crearEstructura() {

    return $('#mostrar').html(` 
    <div class='row flex-center'>
        <div class='twelve columns'>
               
             <table class='u-full-width'>
                     <thead>
                         <tr>
                             <th>Nombre</th>
                             <th>Monto</th>
                             <th>Cuotas</th>
                             <th>Total Cuotas</th>
                             <th>Intereses</th>
                             <th>Total Prestamo</th>
                         </tr>
                     </thead>
                     <tbody id='cuerpo'>    
            </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
    
</div>`);
}



/* Función con los condicionales para invocar las cotizaciónes segun el caso.  
---------------------------*/
function cantidadCotizaciones() {

    const cantidad = dataBase.length;

    if (cantidad === 0) {
        let mensaje = 'No hay cotizaciones anteriores';
        alerta(mensaje);
        cerrarAlert();
        return false;
    }

    if (cantidad === 1) {
        $('#formulario').hide(1200);
        let mensaje = 'Esta visualizando la unica cotización en el sistema!';
        alerta(mensaje);
        cerrarAlert();
        recorrerDataBase();
        botonVolver();

    }
    if (cantidad > 1) {
        $('#formulario').hide(1200);
        let mensaje = 'Esta visualizando el total de cotizaciones anteriores en nuestro sistema';
        alerta(mensaje);
        cerrarAlert();
        recorrerDataBase();
        botonVolver();
    }
}


/* Borrar inputs
---------------------------*/
function borrarInputs() {
    //Muestra nuevamente la estructura del formulario
    $('#formulario').show(1000);

    //Borra los datos de los Inputs
    nombre = $('#nombreInput').val('');
    monto = $('#montoInput').val('');
    cuotas = $('#cuotasInput').val('');

    //Limpia el Local Storage
    localStorage.clear();

    //Elimina la estructura de la 'Tabla' y el botón 'Volver'
    $('#mostrar').html('');
    $('#container-ver').html('');
}

/* Función para mostras las cotizaciones anteriores en el sistema.
- Crea la estructura
- Inserta los datos 
---------------------------------*/
function recorrerDataBase() {

    crearEstructura();

    $('#cuerpo').html('');

    for (const item of dataBase) {
        
        let fila = document.createElement('tr');
        document.querySelector('#cuerpo').appendChild(fila);

        let nombre = document.createElement('td');
        nombre.innerHTML = item[0];
        fila.appendChild(nombre);

        let monto = document.createElement('td');
        monto.innerHTML = item[1];
        fila.appendChild(monto);

        let cuotas = document.createElement('td');
        cuotas.innerHTML = item[2];
        fila.appendChild(cuotas);

        let totalCuotas = document.createElement('td');
        totalCuotas.innerHTML = item[3];
        fila.appendChild(totalCuotas);

        let intereses = document.createElement('td');
        intereses.innerHTML = item[4];
        fila.appendChild(intereses);

        let totalPrestamo = document.createElement('td');
        totalPrestamo.innerHTML = item[5];
        fila.appendChild(totalPrestamo);
    }
}

/* Botón para volver al simulador.

- Cuando la función se invoca crea el botón para volver. 
- Cuando se presiona el botón borra los valores del formulario. 
------------------------------------*/
function botonVolver() {

    $('#container-ver').html(`

    <div class='row flex-center'>
    <div class='six columns'>
        <input id='boton-borrar' type='button' class='button button-primary u-full-width'
    value='Volver'>
     </div>`);

    //Con el clic invoca la función borrar inputs
    $('#boton-borrar').on('click', borrarInputs);

}

/* Función que le da las animaciones a las notificaciones
- Aparecer 
- Desaparecer
-------------------------------------*/
function cerrarAlert() {
    //Elimina automaticamente la notificación pasados 3 segundos
    setTimeout(function () {
        $(".notification-content").fadeOut(2500);
    }, 5000);
    //permite que el usuario elimine la notificación de forma manueal
    $('#cerrar').on('click', function () {

        $(".notification-content").fadeOut(2000);

    })
}

