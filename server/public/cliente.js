//Va a contener el código de p5js y la lógica del cliente
const socket = io();
let size = 20;
let r = 0;
let g = 0;
let b = 0;
let identificador = 0;

let elementos = [];
let cursores = [];

function setup() {
    createCanvas(400, 400);
    r = int(Math.random()*255)
    g = int(Math.random()*255)
    b = int(Math.random()*255)
    identificador = int(random()*1000)
    console.log
}

function draw() {
    background(220);

    //pintamos los items dentro de la lista de elementos
    elementos.forEach((elemento) =>{
        fill (elemento.r, elemento.g, elemento.b);
        ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
    });

    //pintamos los items dentro de la lista de cursores
    cursores.forEach((elemento) => {
        fill (0, 0, 0);
        ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
    });
}

function mousePressed() {
    //enviar la posición del clic al servidor
    const elemento = {
        x: mouseX,
        y: mouseY,
        r: r,
        g: g,
        b: b,
        size
    };
    //se envia el elemento bajo el tag: "enviar-elemento"
    socket.emit('enviar-elemento', elemento);
}

function mouseDragged() {
    //enviar la posición del arrastre al servidor
    const elemento = {
        x: mouseX,
        y: mouseY,
        r: r,
        g: g,
        b: b,
        size,
        id: identificador
    };
    //enviamos el elemento con el tag: "enviar-cursor"
    socket.emit('enviar-cursor', elemento);
}

socket.on('elemento-recibido', (elemento) => {
    //dibujar el elemento recibido en otro cliente
    console.log("recibiendo-elemento:", elemento)
    elementos.push(elemento)
});

socket.on('cursor-recibido', (elemento) => {
    //dibujar el elemento recibido en el otro cliente
    console.log("recibiendo-cursor:", elemento)
    //seleccionamos el elemento que tiene el identificador
    let cursorIndex = cursores.findIndex((item) => elemento.id == item.id)
    //si existe ya ese cursor con el identificador
    if(cursorIndex!=-1){
        //remplazamos el cursor con el nuevo (nueva posición)
        cursores[cursorIndex] = elemento;
    } else {
        //si no existe, se agrega a la lista
        cursores.push(elemento)
    }
});

// Esta función se llama cuando el usuario cambia el color en el selector de color.
function cambiarColor(nuevoColor) {
    const color = hexToRgb(nuevoColor);
    r = color.r;
    g = color.g;
    b = color.b;
}
// Convierte un valor hexadecimal de color en un objeto de color RGB.
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    // Convierte el valor hexadecimal en componentes RGB.
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

// Esta función se llama cuando el usuario cambia el color en el selector de color.
function cambiarSize(nuevaSize) {
    size = parseInt(nuevaSize);
}

// Esta función se llama cuando el usuario hace clic en el botón de borrar dibujos.
function clearCanvas() {
    elementos = [];
}

