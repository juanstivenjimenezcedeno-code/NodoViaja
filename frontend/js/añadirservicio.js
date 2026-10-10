// ++++++++++++++++++++++ esto es del registro 

// Ejemplo de Feedback UX con JavaScript
const formulario = document.getElementById('servicioForm');
const boton = document.getElementById('btn-guardar');


formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita que la página recargue de inmediato

    // // UX: Desactivar el botón para evitar doble-clic
    // boton.disabled = true;
    // boton.innerText = "Guardando...";   //esto aqui no sirve 

    // Aquí es donde enviaremos los datos al Mesero (Backend)...

    // 1. Tomamos varables
    const servinombre = document.getElementById('nombreServicio').value;
    const servidescripcion = document.getElementById('descripcionServicio').value;
    const serviprecio = document.getElementById('precioServicio').value;
    const servitipo = document.getElementById('tipoServicio').value;


    // 2. Llamamos al Mesero (Backend) en el puerto 3000
    try {
        const respuesta = await fetch('http://localhost:3000/api/tipos_servicio', {
            method: 'POST', // Queremos "enviar" información
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: servinombre, descripcion: servidescripcion, precio: serviprecio, tiposervicio: servitipo })
        });

        if (respuesta.ok) {
            alert('¡servicio añadido!');
            formulario.reset(); // Limpiamos el formulario
        }
    } catch (error) {
        alert('El server no responde. Revisa si el servidor está encendido.');
    }
});



