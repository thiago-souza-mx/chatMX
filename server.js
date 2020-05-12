const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(express.static("public"))
app.use(bodyParser.json())

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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/chatMX-admin/index.html')
})

app.get('/push', function (req, res) {
    res.sendFile(__dirname + '/api/push.json') 
})

app.get('/push/:id', function (req, res) {
    var id = req.params.id

    fs.readFile(__dirname + '/api/push.json','utf8', function(err,data){
        var text 
        if(data){
            text = JSON.parse(data)
            res.json(text[id])
        }else
            res.json(text[id])
	})
    //fs.writeFileSync(__dirname + '/api/push.json', JSON.stringify(state))
   
})

app.post('/push/register', function (req, res) {
    fs.readFile(__dirname + '/api/push.json','utf8', function(err,data){
        var text 
        var check = false 
       
        if(data){
            text = JSON.parse(data)      

            for(var i=0; i<text.length; i++) {
                if(text[i].token === req.body.token ) {
                    check = true
                    break
                }
            }
            if(!check){
                text.push(req.body)
                fs.writeFileSync(__dirname + '/api/push.json', JSON.stringify(text))
            }
        } else{
            text = []
            text.push(req.body)
            fs.writeFileSync(__dirname + '/api/push.json', JSON.stringify(text))
        }
        res.json(text)
                    
        })
    
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

	socket.on('ping', function(){
        serverSocket.emit('ping')
    })
	

})

