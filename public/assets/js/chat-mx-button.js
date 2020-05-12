/*##########################################################
    Script de criação do botão para chat 
    Gestão sonora de alertas e integração com outros sites

    Este contéudo faz parte do app de Suporte "CHAT-MX"
    Desenvolvido por Thiago Souza
    Propriedade de Designer MX 

###########################################################*/

let _ = elem =>{
	return document.querySelector(elem)
}
let create = elem =>{
	return document.createElement(elem)
}
let j = elem =>{
	return jQuery(elem)
}

let valid = elem=>{
    //console.log(typeof elem === "undefined")
    return typeof elem !== "undefined"
}


let loadJquey = ()=>{
	let jquery = create('script')
	jquery.type = 'text/javascript'
	jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js'
	_('head').appendChild(jquery)
}

/*--- Sound Alert Creator ---*/
const to =16.6,	me = 10.7,
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
/*--- END Sound Alert Creator ---*/


/*--- IFRAME FAKE ---*/
const state = {
    position: "right"
}

let iframeChat = props=>{
	
	const host = `${window.location.protocol}//${window.location.host}`
	
    ifr = {}

    let iframe = document.createElement("iframe")
    iframe.id = "fake"
    _('#chat-mx-body .content').appendChild(iframe)

    iframeDoc = _('iframe#fake').contentDocument

    ifr.css = iframeDoc.createElement("link")
    ifr.css.type = "text/css";
    ifr.css.setAttribute("rel","stylesheet")
    ifr.css.href = "/assets/css/chat-mx-user.css";

    ifr.js = iframeDoc.createElement("script");
    ifr.js.type = "text/javascript";
    ifr.js.src = "/assets/js/chat-mx-user.js"

    ifr.io = iframeDoc.createElement("script");
    ifr.io.type = "text/javascript";
    ifr.io.src =`${host}/socket.io/socket.io.js`;

    ifr.user = iframeDoc.createElement("script");
    ifr.user.type = "text/javascript";
    ifr.user.innerHTML = `const chatUser={host:"${host}",nome:"${props.nome}",email:"${props.email}",id:"${props.idUser}"}`;

    iframeDoc.head.appendChild(ifr.css)
    iframeDoc.head.appendChild(ifr.user)
    iframeDoc.body.appendChild(ifr.io)
    iframeDoc.body.appendChild(ifr.js)
  

}


/*--- END IFRAME FAKE ---*/


const chatMX = props=>{

    loadJquey()    
    start = {}
	
	let HTML = ""
	
	HTML += `<div id="chat-mx-body" style="display:none; width:`+props.width+`px;height:`+props.height+`px;" class="`+(valid(props.position) ? props.position: state.position)+`">`
	HTML += `	<div class="minimize">&#128469;</div>`
	HTML += `	<div class="close">&#10005;</div>`
	HTML += `	<div class="content">`
	HTML += `	</div>`
	HTML += `</div>`
	HTML += `<div id="chatMX_button" class="`+(valid(props.position) ? props.position: state.position)+`"><div class='baloom'>chat<b>MX</b></div><div id="notify"><span></span></div></div>`
	
	start.css = create('link')
	start.css.id = "chat-mx-style"
	start.css.setAttribute('type','text/css')
	start.css.href = props.styleSheet +"?"+ new Date().getTime()
	start.css.rel = "stylesheet"
	
	start.chat = create('div');
    start.chat.id = "chat-mx"
   	start.chat.innerHTML = HTML
	
	_("head").appendChild(start.css);
	_("body").appendChild(start.chat);
	
	var startChat = 0
	_('#chatMX_button').addEventListener("click", ()=>{
		if(startChat == 0){
            startChat = 1
            iframeChat(props)			
		}else{
			document.getElementById('fake').contentWindow.maximize();
		}	
		
		if(permit == 0){
			som.x = 0
			alertSound(som)
			permit = 1/*--- Permite a construção do alerta sonoro ---*/
		}
		j('#chat-mx-body').show(600)
		j('#chatMX_button').hide(600)
		
	})

	_('#chat-mx-body .minimize').addEventListener("click", ()=>{
		document.getElementById('fake').contentWindow.minimize();
		j('#chat-mx-body').hide(400)
		j('#chatMX_button').show(400)
	})

	_('#chat-mx-body .close').addEventListener("click", ()=>{
		startChat = 0
		document.getElementById('fake').contentWindow.fechar()
		
		j('#chat-mx-body').hide(400)
		j('#chatMX_button').show(400)
		setTimeout(()=>{
			_('#chat-mx-body .content').innerHTML = ''
		},500)
    })
    
	
}

function deactivateNotify(){
	j('#notify span').text('')
	j('#notify').hide(600)
	document.getElementById('fake').contentWindow.setLido()
}

function activateNotify(num){
	j('#notify span').text(num)
	som.x = 1
	som.frequency = 3
	alertSound(som);/*--- dispara do alerta sonoro a cada msg em modo minimizado ---*/
	
	j('#notify').show(200,"linear")
}

function bubleAlertSound(x,f){
	som.x = x
	som.frequency = f
	alertSound(som);/*--- dispara do alerta sonoro a cada msg em modo minimizado ---*/
}