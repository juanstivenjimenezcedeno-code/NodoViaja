// 1. Llamar a las herramientas
require('dotenv').config(); // Esto lee tu archivo .env mágicamente
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// 2. Configurar el comportamiento (Buenas Prácticas)
app.use(cors()); // Permitir que el Frontend nos hable
app.use(express.json()); // Entender los datos que lleguen en formato JSON

const pool = mysql.createPool(process.env.DATABASE_URL);











//+++++++++++++++++++++Endpoint 1, insertar usuario

app.post('/api/usuarios', async (req, res) => {
    const { nombre, apellido, correo, telefono, contrasena } = req.body; //datos sacados del body 
    // Comprobar que no falte ningún dato
    if (!nombre || !apellido || !correo || !telefono || !contrasena) {//mira q no falten datos 
        return res.status(400).json({
            exito: false,
            error: 'Faltan datos obligatorios'
        });
    }
    try {// Insertar el nuevo usuario en la base de datos
        await pool.query(
            `INSERT INTO usuarios 
            (nombre, apellido, correo, telefono, contrasena, id_rol)
            VALUES (?, ?, ?, ?, ?, ?)`,  //espacio reservado para los valores
            [nombre, apellido, correo, telefono, contrasena, 2]
        );
        // Respuestas posibles 
        res.status(201).json({
            exito: true,
            mensaje: 'Usuario agregado correctamente'
        });
    } catch (error) {
        console.error("❌ Error insertando usuario en SQL:", error);
        res.status(500).json({
            exito: false,
            error: 'Error insertando usuario'
        });
    }
});














//++++++++++++++++++++++Endpoint 2, inisio de sesion 

app.post('/api/login', async (req, res) => { //post es más privado que el get, req peticion del cliente y res respuesta al cliente 
    const { correo, contrasena } = req.body; //rep pide lo que haya escrito en el body
    console.log("Petición de login recibida:", { correo, contrasena }); //muestra si funciona
    if (!correo || !contrasena) {
        return res.status(400).json({ exito: false, error: 'Faltan datos' }); //error(401), mira si falta un dato si es asi manda el msj
    }
    try { //intenta ejecutar instrucciones como si fuera un if y un else
        const [filas] = await pool.query( // consulta el SQL
            'SELECT * FROM usuarios WHERE correo = ? AND `contrasena` = ?',  // evita vulnerabidades (?), lo cual protege el sistema contra inyecciones SQL.
            [correo, contrasena]
        );
        console.log("Filas encontradas en DB:", filas); //muestra quien entró en la terminal 
        if (filas.length > 0) { //length para ver si en las filas encontro resultados 
            res.status(200).json({ exito: true, usuarios: filas[0] }); //estatus(200) todo bien con los datos, filas 0 dame al primer usuario q coincida
        } else {
            res.status(401).json({ exito: false, error: 'Correo o contraseña incorrectos' }); // si no status(401) error culpa de usuario
        }
    } catch (error) { // si no sale bien el try se salta al catch
        console.error("❌ Error en SQL:", error); //muestra que pasó
        res.status(500).json({ exito: false, error: 'Error en el servidor' }); //estatuss(500) error del servidor
    }
});








//++++++++++++++añadir servicio






app.post('/api/tipos_servicio', async (req, res) => {
    const { nombre, descripcion, precio, tiposervicio } = req.body; //datos sacados del body 
    // Comprobar que no falte ningún dato
    if (!nombre || !descripcion || !precio || !tiposervicio) {//mira q no falten datos 
        return res.status(400).json({
            exito: false,
            error: 'Faltan datos obligatorios'
        });
    }
    try {// Insertar el nuevo usuario en la base de datos
        await pool.query(
            `INSERT INTO tipos_servicio 
            (nombre, descripcion, precio, tiposervicio)
            VALUES (?, ?, ?, ?)`,  //espacio reservado para los valores
            [nombre, descripcion, precio, tiposervicio]
        );
        // Respuestas posibles 
        res.status(201).json({
            exito: true,
            mensaje: 'servicio agregado correctamente'
        });
    } catch (error) {
        console.error("❌ Error insertando servicio en SQL:", error);
        res.status(500).json({
            exito: false,
            error: 'Error insertando servicio'
        });
    }
});



























//esto comprobara que este conectado al servidor  solo debo poner, node servidor.js
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado correctamente a MySQL');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a MySQL:', error.message);
    });

// Inicio del servidor
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PUERTO}`);
});




//iam snow; iam JohanCollazos  