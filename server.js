const express = require('express')
const app = express()

app.use(express.static("public"))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = process.env.PORT || 8000

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/index.html')
})

app.get('/admin', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/chatMX-admin/index.html')
})


serverSocket.on('connect', function(socket){
    socket.on('login', function (json) {
        const msg = JSON.parse(json)
		msg.event = "logou"
		serverSocket.emit('login', JSON.stringify(msg))
    })

    socket.on('disconnect', function(json){
        const msg = {msg:json, event:"saiu"}
		serverSocket.emit('disconnect', JSON.stringify(msg))
    })
        
    socket.on('chat msg', function(msg){
        serverSocket.emit('chat msg', msg)
    })

    socket.on('digiting', function(msg){
        serverSocket.emit('digiting', msg)
    })
	
	socket.on('read', function(msg){
		serverSocket.emit('read', msg)
    })	
	
	socket.on('close', function(msg){
        serverSocket.emit('close', msg)
    })
	

})

