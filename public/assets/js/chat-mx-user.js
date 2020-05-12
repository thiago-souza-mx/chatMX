let socket

let lido

chatMX ={}

var user = ""
var user_id = ""
var control = -1
var disponivel = 0
var digiting = 0
var notify = 0
let create = elem =>{
	return document.createElement(elem)
}
let _ = elem =>{
	return document.querySelector(elem)
}
let GetQueryString = (a)=>{
    a = a || window.location.search.substr(1).split('&').concat(window.location.hash.substr(1).split("&"));

    if (typeof a === "string")
        a = a.split("#").join("&").split("&")

    if (!a) return {}

    let b = {}
    for ( i = 0; i < a.length; ++i)
    {
        let p = a[i].split('=')
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "))
    }
    return b;
}

let loadJquey = ()=>{
	let jquery = create('script')
	jquery.type = 'text/javascript'
	jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js'
	_('head').appendChild(jquery)
}

let sendPushMessage = props=> {
	objectPush =
	 {
		 "to": `${props.token}`,
		 "data": {
			 "message": `${props.nome} ${props.msg}`
		 },
		 "notification": {
			 "body": `${props.nome} ${props.msg}`,
			 "badge": 1,
			 "sound": "ping.aiff"
		 }
	 }
	 
	 

	 var url = "https://api.pushy.me/push?api_key=40da300b73449699a228848976a3568305255b1bf183d868b7242c0bef2df959";

   
	 var json = JSON.stringify(objectPush);

		 var xhr = new XMLHttpRequest();
		 xhr.open("POST", url, true);
		 xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		 //xhr.setRequestHeader('Authorization','Key=AAAAu5Egnr8:APA91bE_jUlU75ydpjHQipE-EXOsb9z284lMhAuVD8LPtzom2fvxTRMbe14f5SAwX2nULteiwp32y4HX_s5NB9e_rocsY9pqHRuVvh44HBhYb2gjfnqvR5O0xdC2O9TeT6Ww88vvKMEK');
		 xhr.onload = function () {
			 var users = JSON.parse(xhr.responseText);
			 if (xhr.readyState == 4 && xhr.status == "200") {
				 //console.table(users);
			 } else {
				 //console.error(users);
			 }
		 }
		 xhr.send(json);
		
	 
   }

 let push = props=>{
	 
	fetch(`${chatUser.host}/pus`).then(res=>res.json()).then(res =>{
		for(let i=0; i<res.length; i++){
			props.token = res[i].token
			sendPushMessage(props)
		}
	
	});
	 
 }

(async () => {

let loadChat = ()=>{
	

	
	chatMX.button = create("div")
	chatMX.button.id = "chatMX_button"
	//if(window.location.search.indexOf("iframe")>-1)
		chatMX.button.setAttribute("class","iframe")

	
	chatMX.button.innerHTML = "<div class='baloom'>chat<b>MX</b></div>"

	chatMX.body = create("div")
	chatMX.body.id = "chatMX"
	
	//if(window.location.search.indexOf("iframe")>-1)
		chatMX.body.setAttribute("class","iframe")
	
	
	chatMX.wrapper = create("div")
	chatMX.wrapper.id = "chatMX_wrapper"
	
	chatMX.header = create("div")
	chatMX.header.id = "chatMX_header"
	chatMX.header.innerHTML = "<div class='titulo'><h2>chatMX</h2><div id='suporte'>SUPORTE [ <b><span style='color:red'>OFF-Line</span></b> ]</div></div><div class='close'>&#10005;</div>"
	
	chatMX.content = create("div")
	chatMX.content.id = "chatMX_content"
	
	chatMX.conversation = create("div")
	chatMX.conversation.id = "chatMX_conversation"
	chatMX.conversation.setAttribute("class","scroll")
	
	chatMX.footer = create("div")
	chatMX.footer.id = "chatMX_footer"
	chatMX.footer.innerHTML = "<div class='msg-box'><div id='st_digit'>digitando...</div><input id='chatMX_msg' type='text' placeholder='Digite sua mensagem' autocomplete='off'><div class='msg-send'>&#10148;</div></div>"
	
	
	chatMX.alert = create("div")
	chatMX.alert.id = "chatMX_alert"	
	chatMX.alert.setAttribute("style","display:none")
		
	_('body').appendChild(chatMX.body)	
	_('body').appendChild(chatMX.button)	
	_('#chatMX').appendChild( chatMX.wrapper )
	_('#chatMX').appendChild( chatMX.alert )
	_('#chatMX_wrapper').appendChild( chatMX.header )
	_('#chatMX_wrapper').appendChild( chatMX.content )
	_('#chatMX_content').appendChild( chatMX.conversation )
	_('#chatMX_wrapper').appendChild( chatMX.footer )
	
}

let loadIO =()=>{
	socket = io(chatUser.host)

	socket.on('chat msg', function(msg){		
		const data = JSON.parse(msg);		
		//console.log(data)
		if(data.origem == 'to')
			disponivel = data.session
		if( data.session == user_id ){
			if(disponivel == user_id)
				_("#suporte > b").innerHTML="<span style='color:green'>Disponível</span>"
			else
				_("#suporte > b").innerHTML="<span style='color:yellow'>Aguarde</span>"
			if(data.msg){
				buble(data);
				if(!notify > 0)
					lido();
			}
		}else{
			if(disponivel != user_id && disponivel != 0)
				_("#suporte > b").innerHTML="<span style='color:yellow'>Aguarde</span>"
			
		}
		
		
	});
	
	socket.on('login', function(msg){		
		const data = JSON.parse(msg);		
		//console.log(data)	
		if(!data.origem || data.nome == "SUPORTE" ){
			if(data.nome == "SUPORTE" && data.conexao == "on"){		
				
				if(control == -1){
					_("#suporte > b").innerHTML="<span style='color:green'>On-Line</span>"
					usuario.msg = "está online"
					usuario.conexao = "on"			
					socket.emit('login', JSON.stringify(usuario));
					_("#chatMX_msg").removeAttribute("disabled")
					_(".msg-box").classList.remove("disabled")
					//console.log(data);
					control = 0					
				}
			}else{
				if(control == 0){
					disponivel = 0
					_("#suporte > b").innerHTML="<span style='color:red'>Off-Line</span>"
					_("#chatMX_msg").setAttribute("disabled",true)
					_(".msg-box").classList.add("disabled")					
					control = -1					
				}
				
			}
		}
	});
	
	socket.on('disconnect', function(msg){		
		//const data = JSON.parse(msg);		
		console.log(msg)		
	});
	
	socket.on('digiting', function(msg){		
		const data = JSON.parse(msg);		
		if(data.session == user_id)
			_("#st_digit").style.display= "block";		
	});	
	
	socket.on('read', function(msg){		
		const data = JSON.parse(msg);		
		if(data.session == user_id){
			let enviado = document.querySelectorAll('.info.enviado')
			for(i=0; i<enviado.length; i++){
				enviado[i].classList.add('lido');
				enviado[i].classList.remove('enviado');				
			}
		}
	});		
	
	socket.on('close', function(msg){		
		const data = JSON.parse(msg);		
		//console.log(data)		
	});	
	
	socket.on('ping', function(){		
		console.log(socket)		
	});
	
	let interval = setInterval(()=>{_("#st_digit").style.display= "none";},1000);
	let ping = setInterval(()=>{socket.emit('ping')},1000*60*5);


	let buble = props=>{

		html = "<div class='msg'> "+props.msg+" </div>"
		html += "<div class='info "+( props.origem == "me" ? "enviado" : "" )+"'>"
		html += "	<div class='origem'>"+( props.origem == "to" ? "Suporte" : props.remetente )+"</div>"
		html += "	<div class='time'>"+time()+"</div></div>"
		html += "</div>"

		if(props.origem == "to"){
			
			if(notify > 0){
				setNotify()
				notify++
			}else
				window.parent.bubleAlertSound(0.1,1)
		}else
			window.parent.bubleAlertSound(0.1,2)
		let buble= create("div")
		buble.setAttribute("class", "box-msg "+props.origem )
		buble.innerHTML = html
		_("#chatMX_conversation").appendChild(buble)
		_("#chatMX_conversation").scrollTop =_("#chatMX_conversation").scrollHeight;
			
	}
	let setNotify = ()=>{
		window.parent.activateNotify(notify);
	}
	let time =()=>{

	var dNow = new Date();
	var localdate = dNow.getDate() + '/' +
	(dNow.getMonth()+1) + '/' +
	dNow.getFullYear().toString().substr(-2) + ' ' + 
	(dNow.getHours() <= 9? "0"+dNow.getHours(): dNow.getHours() )+ ':' + 
	(dNow.getMinutes() <= 9 ?"0"+dNow.getMinutes() :dNow.getMinutes() );

	return localdate
	}

	let json = ()=>{
		let conversa = '{"texto":"oi"}'
		let blob = new Blob([conversa], { type: "application/json ;charset=utf-8" })
		let url = URL.createObjectURL(blob)
		console.log(url)	
	}

	//################################################################################
	//		FUNCTIONS Interact
	//################################################################################
	let query = chatUser;
	user = query.nome ? query.nome : "User"
	user_id = !!query.id?query.id:""

	interact = {
		session: user_id,
		msg: "",
		remetente:user,
		origem : "me",
		time:time()
	}

	usuario = {
		origem : 'client',
		nome : user,
		email : !!query.email?query.email:"",
		data: time(),
		id : !!query.id?query.id:""
	}

	let sendMessage = props=>{
		interact.msg = props.msg
		interact.session = user_id
		interact.remetente = user,
		interact.origem = "me"
		//buble(interact)
		//sendRequestMessage(interact)
		socket.emit('chat msg', JSON.stringify(interact));
	}

	let digitAction = props=>{	
		socket.emit('digiting', JSON.stringify({id:user_id,digit:props.digit}));
	}

	lido = ()=>{	
		socket.emit('read', JSON.stringify({id:user_id,lido:true}));
	}

	let initUser =()=>{

		setTimeout( ()=> {
			try{
				usuario.msg = "está online"
				usuario.conexao = "on"			
				socket.emit('login', JSON.stringify(usuario));
				push(usuario);
			
			}catch(e){
				initUser()
			}
		},100)

	}



	//################################################################################
	//		FUNCTIONS UX
	//################################################################################

	let loadFunctions = ()=>{
		let j = elem =>{
			return jQuery(elem)
		}
		
		_('#chatMX_button').addEventListener("click", ()=>{
			j('#chatMX').show(400)
			j('#chatMX_button').hide(400)
		})

		_('#chatMX_header .close').addEventListener("click", ()=>{
			j('#chatMX').hide(400)
			j('#chatMX_button').show(400)
		})

		_("#chatMX_msg").addEventListener("keyup", e=>{
			if(e.which != 13)
				digitAction({digit:true}) 
		})
		
		_("#chatMX_msg").addEventListener("click", ()=>{
			lido()
		})
		
		_('#chatMX_footer .msg-send').addEventListener("click", ()=>{
			if(!_(".msg-box.disabled")){
				let msg = _("#chatMX_msg").value
				sendMessage({msg:msg})
				_("#chatMX_msg").value = ""
				_("#chatMX_msg").focus()
			}
		})
		
		_(".msg-box").addEventListener("click", ()=>{
			
			if(_(".msg-box.disabled")){
				_("#chatMX_alert").innerHTML = "Não há ninguém online";
				j("#chatMX_alert").show(100,"linear");
				setTimeout(()=>{
					j("#chatMX_alert").hide(50,"linear");
				},2000)
			}
		
		})
		document.addEventListener('keypress', function(e){
			if(e.which == 13){
				let msg = _("#chatMX_msg").value
				sendMessage({msg:msg})
				_("#chatMX_msg").value = ""
			}
		}, false);
	}

	loadFunctions()
	initUser();
}


// Manter no Final

window.onbeforeunload = function() {
    usuario.conexao="off"
    socket.emit('login', JSON.stringify(usuario));
}

if (!window.jQuery){ 
		loadJquey()	
	}
	loadChat()
	setTimeout(()=>{
		loadIO()
	},1000)
	
	//json()
	

	


})();


function setLido(){
	lido()
}

function minimize(){
	notify = 1
}

function maximize(){
	notify = 0
	window.parent.deactivateNotify()
}

function fechar(){
	usuario.msg = "Desconectou"
	usuario.conexao = "off"
	socket.emit('login', JSON.stringify(usuario));
	
	push(usuario);
}
