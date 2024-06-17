const socket = io();

var click = false
var moving_cursor = false
var x_position = 0
var y_position = 0
var previous_position = null
var color = 'black'
const users_counter = document.getElementById('users_counter')

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

canvas.addEventListener('mousedown', (e) => {
    click = true
})

canvas.addEventListener('mouseup', (e) => {
    click = false
})

canvas.addEventListener('mousemove', (e) => {
        x_position = e.clientX
        y_position = e.clientY
        moving_cursor = true
})

function changeColor(c) {
    color = c
    context.strokeStyle = color
    context.stroke()
}

function deleteDrawing() {
    socket.emit('delete_drawing')
}

function createDrawing() {
    if(click && moving_cursor && previous_position != null) {
        let draw = {
            x: x_position,
            y: y_position,
            color: color,
            previous_position: previous_position
        }
        socket.emit('drawing', draw)
    }
    previous_position = {x: x_position, y: y_position}
    setTimeout(createDrawing, 20)
}

socket.on('show_drawing', draw  => {
    if (draw != null) {        
        context.beginPath()
        context.moveTo(draw.x, draw.y)
        context.lineTo(draw.previous_position.x, draw.previous_position.y)
        context.strokeStyle = draw.color
        context.lineWidth = 10
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.stroke()
    }
    else {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
})

socket.on('users_counter', (users) => {
    users_counter.innerHTML = 'Usuarios conectados: ' + users
})

createDrawing()