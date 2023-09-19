//Va a contener el código del servidor, aquellas funcionalidades que deben correr en el backend.

//importamos las librerias
const e = require('express');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//generamos las instancias
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//Vamos a enviar de manera estatica el contenido de public
app.use(express.static(__dirname + '/public'));

//detectamos la conexión de un nuevo cliente
io.on('connection', (socket) => {
    //informamos acerca de la conexión de un nuevo cliente
    console.log('un cliente se ha conectado');

    //detectamos la recepción de un mensaje con el tag: "enviar-elemento"
socket.on('enviar-elemento', (elemento) => {
    //transmitir el elemento a todos los clientes, incluido el remitente
    io.emit('elemento-recibido', elemento);
});

//detectamos la recepción de un mensaje con el tag: "enviar-cursor"
socket.on('enviar-cursor', (elemento) => {
    //transmitir el elemento a todos los clientes, incluido el remitente
    io.emit('cursor-recibido', elemento);
});

//detectamos el cambio de estado desconectado
socket.on('disconnect', () => {
    //informamos de la desconexion de un cliente
    console.log('un cliente se ha desconectado');
});
});
server.listen(3000, () => {
    console.log('servidor escuchando en el puerto 3000');
});
