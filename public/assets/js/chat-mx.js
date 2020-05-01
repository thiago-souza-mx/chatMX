// chat-mx.js

chatMX ={}

var session_id = -1
let create = elem =>{
	return document.createElement(elem)
}
let _ = elem =>{
	return document.querySelector(elem)
}

/*--- Sound Alert Creator ---*/
const to =86.6,	me = 180.7,
	  min = 1920.6, 
som ={
	frequency:3,
	type: "sine",
	x: 0
}
let context,
	oscillator,
	contextGain,
	permit = 0

let startSound = props=>{
	context = new AudioContext()
	oscillator = context.createOscillator()
	contextGain = context.createGain()
	oscillator.frequency.value = props.frequency;
	oscillator.type = props.type;
	oscillator.connect(contextGain)
	contextGain.connect(context.destination)
	oscillator.start(0)
}

let alertSound = props=>{
	if(props.frequency == 1)
		props.frequency = to
	else if(props.frequency == 2)
		props.frequency = me
	else if(props.frequency == 3)
		props.frequency = min
	else
		props.frequency = me
	
	startSound(props);
	contextGain.gain.exponentialRampToValueAtTime(
  	0.00001, context.currentTime + props.x
	)
}

function bubleAlertSound(x,f){
	som.x = x
	som.frequency = f
	alertSound(som);/*--- dispara do alerta sonoro a cada msg em modo minimizado ---*/
}
/*--- END Sound Alert Creator ---*/

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

const socket = io()

let loadChat = ()=>{

    let sendPushMessage = props=> {
       objectPush =
        {
            "to": "e92f509db941c4aebe4616",
            "to": "6ebaa88dcceb9e661f4cca",
            "data": {
                "message": `Novo chat`
            },
            "notification": {
                "body": `${props.nome} entrou no chat`,
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
       
        //sendPushMessage(props)
        
    }

// Ao receber mensagens do servidor
	socket.addEventListener('open', function (event) {
		//console.log(event)
	})

	
	socket.on('chat msg', function(msg){		
		const data = JSON.parse(msg);		
		buble(data)
		lido();		
	});
	
	socket.on('login', function(msg){		
		const data = JSON.parse(msg);
		//console.log(data)
		if(data.origem == "client")
            setUser(data)
	});
	
	socket.on('disconnect', function(msg){		
		const data = JSON.parse(msg);		
		//console.log(data)		
	});
	
	socket.on('digiting', function(msg){		
		const data = JSON.parse(msg);		
		if(data.id == session_id)
			_("#st_digit").style.display= "block";		
	});	
	
	socket.on('read', function(msg){		
		const data = JSON.parse(msg);		
		if(data.id == session_id){
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

	
    let interval = setInterval(()=>{_("#st_digit").style.display= "none";},1000);
    
    chatMX.sidebar = create("div")
    chatMX.sidebar.id = 'chatMX_sidebar'
    
	chatMX.button = create("div")
	chatMX.button.id = "chatMX_button"
	if(window.location.search.indexOf("iframe")>-1)
		chatMX.button.setAttribute("class","show iframe")
	else
		chatMX.button.setAttribute("class","show")
	
	chatMX.button.innerHTML = "<div class='baloom'>chat<b>MX</b></div>"

	chatMX.body = create("div")
	chatMX.body.id = "chatMX"	
	chatMX.body.setAttribute("class","overframe")	
	chatMX.wrapper = create("div")
	chatMX.wrapper.id = "chatMX_wrapper"
	
	chatMX.header = create("div")
	chatMX.header.id = "chatMX_header"
	chatMX.header.innerHTML = "<div class='titulo'><h2>chatMX</h2></div><div class='user-ativo'></div>"
	
	chatMX.content = create("div")
	chatMX.content.id = "chatMX_content"
	
	chatMX.conversation = create("div")
	chatMX.conversation.id = "chatMX_conversation"
	chatMX.conversation.setAttribute("class","chatMX_conversation scroll")
	
	chatMX.footer = create("div")
	chatMX.footer.id = "chatMX_footer"
	chatMX.footer.innerHTML = "<div class='msg-box'><div id='st_digit'>digitando...</div><input id='chatMX_msg' type='text' placeholder='Digite sua mensagem' autocomplete='off'><div class='msg-send'>&#10148;</div></div>"
	
		
	_('body').appendChild(chatMX.body)	
	//_('body').appendChild(chatMX.button)	
	_('body').appendChild(chatMX.sidebar)	
	_('#chatMX').appendChild( chatMX.wrapper )
	_('#chatMX_wrapper').appendChild( chatMX.header )
	_('#chatMX_wrapper').appendChild( chatMX.content )
	_('#chatMX_content').appendChild( chatMX.conversation )
	_('#chatMX_wrapper').appendChild( chatMX.footer )
	
}

let buble = props=>{

	html = "<div class='msg'> "+props.msg+" </div>"
	html += "<div class='info "+( props.origem == "to" ? "enviado" : "" )+"'>"
	html += "	<div class='origem'>"+( props.origem == "to" ? "Suporte" : props.remetente )+"</div>"
	html += "	<div class='time'>"+time()+"</div></div>"
	html += "</div>"

	
    if(_(`#user_${props.session}:not(.ativo) .new-msg`)){
        n = _(`#user_${props.session}:not(.ativo) .new-msg`).getAttribute("data-msg")
        n++
        _(`#user_${props.session}:not(.ativo) .new-msg`).setAttribute("data-msg",n)
        _(`#user_${props.session}:not(.ativo) .new-msg`).innerHTML= `<span>${n}</span>`

        if(props.origem == "me"){
            _("title").innerText= `${n} nova mensagem`
        }
    }else{
		 if(props.origem == "me"){
			bubleAlertSound(0.1,2)
        }else{
			bubleAlertSound(0.1,1)
		}
	}
	

	let buble= create("div")
	buble.setAttribute("class", "box-msg "+props.origem )
	buble.innerHTML = html
	_(`#chatMX_conversation_${props.session}`).appendChild(buble)
	_(`#chatMX_conversation_${props.session}`).scrollTop =_(`#chatMX_conversation_${props.session}`).scrollHeight;
	
}

let setUser = props=>{
    if(_(`#user_${props.id}`)){       
         _(`#user_${props.id}`).remove()        
    }
    if(props.conexao == "on"){

       // console.log(props)
        chatMX.user = create('div')
        chatMX.user.id = `user_${props.id}`
        chatMX.user.setAttribute('class','session')
        chatMX.user.innerHTML = `<div class="nome" onclick="setSession(${props.id},'${props.nome}')">${props.nome}</div><div class="new-msg" data-msg="0"></div>`

        chatMX.conversation = create("div")
	    chatMX.conversation.id = `chatMX_conversation_${props.id}`
        chatMX.conversation.setAttribute("class","chatMX_conversation scroll")

        _('#chatMX_content').appendChild( chatMX.conversation )
        _('#chatMX_sidebar').appendChild(chatMX.user)
    }
    statusSuporte();
}

let setSession = (id, nome)=>{
	_('#chatMX').classList.remove('overframe')
	_('#chatMX').classList.add('change')
	if(permit == 0){
		som.x = 0
		alertSound(som)
		permit = 1/*--- Permite a construção do alerta sonoro ---*/
	}
    session_id = id
    if(_(".session.ativo"))
        _(".session.ativo").classList.remove("ativo")
    
    _(`#user_${id}`).classList.add("ativo")
    _(`.user-ativo`).innerText= nome

    if(_(`#chatMX_conversation_${id}`)){
        if(_(`.chatMX_conversation.ativo`))
            _(`.chatMX_conversation.ativo`).classList.remove("ativo")
        _(`#chatMX_conversation_${id}`).classList.add("ativo")
    }

    _(`#user_${id} .new-msg`).setAttribute("data-msg",0)
    _(`#user_${id} .new-msg`).innerHTML= ``
	lido()
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

let pagehtml = ()=>{
 
    let obj = '<script> if(window.location.href.indexOf("blob")>-1) alert()</script>' 
    let blob = new Blob([obj], { type: "text/html ;charset=utf-8" })
	let url = URL.createObjectURL(blob)
    console.log(url)

    let iframe = create('iframe')
    iframe.src = url
    iframe.id = 'iframe'
    _('body').appendChild(iframe)    

}

let loadJquey = ()=>{
	let jquery = create('script')
	jquery.type = 'text/javascript'
	jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js'
	_('head').appendChild(jquery)
}

//################################################################################
//		FUNCTIONS Interact
//################################################################################
let query = GetQueryString();
interact = {
	session: session_id,
	msg: "",
	remetente:"Suporte",
	origem : "me",
    time:time()
}

usuario = {
    nome : "SUPORTE",
    email : "teste@teste",
    conexao : "on"
}

let sendMessage = props=>{
	interact.msg = props.msg
	interact.session = session_id
	interact.origem = "to"
	//buble(interact)
	//sendRequestMessage(interact)
    socket.emit('chat msg', JSON.stringify(interact));
    _("title").innerText= `chatMX`
}

let digitAction = props=>{	
	socket.emit('digiting', JSON.stringify({session:session_id,digit:props.digit}));
}

let lido = ()=>{	
	socket.emit('read', JSON.stringify({session:session_id,lido:true}));
}

let initUser =()=>{

    setTimeout( ()=> {
		try{		
			socket.emit('login', JSON.stringify(usuario));
			loop();		 
		}catch(e){
			initUser()
		}
	},1000) 
}

let statusSuporte = ()=>{
    socket.emit('login', JSON.stringify(usuario));
}

let loop = ()=>{
    setTimeout( ()=> {
        socket.emit('login', JSON.stringify(usuario));
        loop();	
    },30000) 
}

//################################################################################
//		FUNCTIONS UX
//################################################################################

let loadFunctions = ()=>{
	let j = elem =>{
		return jQuery(elem)
	}
	
	/*_('#chatMX_button').addEventListener("click", ()=>{
		j('#chatMX').show(400)
		j('#chatMX_button').hide(400)
	})*/

	_("#chatMX_msg").addEventListener("keyup", e=>{
		if(e.which != 13)
			digitAction({digit:true}) 
	})

	_('#chatMX_footer .msg-send').addEventListener("click", ()=>{
		let msg = _("#chatMX_msg").value
		sendMessage({msg:msg})
		_("#chatMX_msg").value = ""
	})
	
	_("#chatMX_header .titulo").addEventListener("click",()=>{
		_('#chatMX').classList.add('overframe')
		_('#chatMX').classList.remove('change')
		if(_(".session.ativo"))
			_(".session.ativo").classList.remove("ativo")
		
	})

	document.addEventListener('keypress', function(e){
		if(e.which == 13){
			let msg = _("#chatMX_msg").value
			sendMessage({msg:msg})
			_("#chatMX_msg").value = ""
		}
     }, false);
     
 
}


// Manter no Final

window.onbeforeunload = function() {
    usuario.conexao="off"
    socket.emit('login', JSON.stringify(usuario));
}

window.onload = ()=>{
   
	if (!window.jQuery){ 
		loadJquey()	
	}
	loadChat()
	loadFunctions()
    //pagehtml()
    initUser()
	
}