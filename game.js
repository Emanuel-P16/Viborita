 VELOCIDAD_VIBORA = 0.5
 ULTIMO_RENDER = 0
EXPANSION_RATE = 1;
let GRID_SIZE = 21;
const cuerpoVibora = [{
    x: 11,
    y:11
}] // lugar donde arranca la vibora en el principio del juego (en el medio del tablero)
let nuevoSegmento=0;
let comida = posicionRandomComida() // posicion de la comida esta fija pero debe ser random
/// JOYSTICK PARAMS
let controlDirection = {x:0, y:0}
let ultimoControlDirection = {x:0,y:0}
// gameOver
perdiJuego = false;

const tablero = document.getElementById('tablero')
function main(currentTime){
    if(perdiJuego){
        if(confirm('Perdiste. Presiona Aceptar para volver a jugar.')){
            location.reload()
        }
        return
    }
        // console.log(currentTime) // currentTime es una variable de la funcion window.requestAnimationFrame
        window.requestAnimationFrame(main)
        const segundosDesdeUltimoRender = (currentTime - ULTIMO_RENDER) / 100; // 
        if (segundosDesdeUltimoRender < 1 / VELOCIDAD_VIBORA) return
        ULTIMO_RENDER = currentTime
    actualiza();
    render();
}

window.requestAnimationFrame(main)

function actualiza(){
    actualizaVibora();
    actualizaComida();
    verificarMuerte();
}

function render(){
    tablero.innerHTML = '';
    renderVibora(tablero);
    renderComida(tablero);
}


function actualizaVibora(){
    agregarSegmento();
    const controlDirection = conseguirControlDirection()
    for (let i = cuerpoVibora.length -2 ; i>=0; i--){
        cuerpoVibora[i + 1] = {...cuerpoVibora[i]}
    }
    cuerpoVibora[0].x += controlDirection.x
    cuerpoVibora[0].y += controlDirection.y
}

function actualizaComida(){
    if(enSerpiente(comida)){
        expandirVibora(EXPANSION_RATE) 
        comida = posicionRandomComida() 
    }
}
function renderVibora(tablero){
    cuerpoVibora.forEach(segmento => {
        const elementoVibora = document.createElement('div');
        elementoVibora.style.gridRowStart = segmento.y;
        elementoVibora.style.gridColumnStart = segmento.x;
        elementoVibora.classList.add('serpiente')
        tablero.appendChild(elementoVibora)
    })
}
function renderComida(tablero){
    console.log('llego')
    const elementoComida = document.createElement('div');
    elementoComida.style.gridRowStart = comida.y
    elementoComida.style.gridColumnStart = comida.x
    elementoComida.classList.add('comida')
    tablero.appendChild(elementoComida)
}


/// INPUT DEL TECLADO
window.addEventListener('keydown',e=>{
    switch(e.key){
        case 'ArrowUp':
            if (ultimoControlDirection.y !== 0) break;
            controlDirection = {x:0,y:-1}
        break
        case 'ArrowDown':
            if (ultimoControlDirection.y !== 0) break;

            controlDirection = {x:0,y:1}
        break
        case 'ArrowLeft':
            if (ultimoControlDirection.x !== 0) break;

            controlDirection = {x:-1,y:0}
        break
        case 'ArrowRight':
            if (ultimoControlDirection.x !== 0) break; // NO PUEDE MOVERSE EN LA MISMA DIRECCION EN LA QUE ESTA

            controlDirection = {x:1,y:0}
        break
    }
})

function conseguirControlDirection () {
    ultimoControlDirection = controlDirection;
    return controlDirection
}

function agregarSegmento(){
    for (let i=0; i < nuevoSegmento; i++){
        cuerpoVibora.push({...cuerpoVibora[cuerpoVibora.length - 1]})
    }
    nuevoSegmento = 0;
}
// VIBORA
function enSerpiente(posicion,{ignorarCabeza = false} = {}){
    return cuerpoVibora.some((segmento, index) =>{
        if (ignorarCabeza && index === 0) return false
        return mismaPosicion(segmento,posicion)
    })
}
function expandirVibora(cantidad){
    nuevoSegmento += cantidad
    VELOCIDAD_VIBORA = VELOCIDAD_VIBORA + 0.10
}

function mismaPosicion(pos1,pos2){
    return (
        pos1.x === pos2.x && pos1.y === pos2.y // retorna verdadero o falso para saber si esta en la misma posicion
    )
}


// COMIDA 
function posicionRandomComida(){
    let nuevaPosicionComida
    while (nuevaPosicionComida == null || enSerpiente(nuevaPosicionComida)){
        nuevaPosicionComida = posicionRandomGrilla();

    }
    return nuevaPosicionComida
}

// GRILLA

function posicionRandomGrilla(){
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1

    }
}
function fueraDeGrilla(posicion){
    return(
        posicion.x < 1 || posicion.x > GRID_SIZE ||
        posicion.y < 1 || posicion.y > GRID_SIZE
    )
}


// game over 
function verificarMuerte(){
    perdiJuego = fueraDeGrilla(cuerpoVibora[0]) || enSerpiente(cuerpoVibora[0], {ignorarCabeza:true})
}