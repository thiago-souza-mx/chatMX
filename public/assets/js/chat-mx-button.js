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


const chatMX = props=>{

	start = {}
	
	let HTML = ""
	
	HTML += `<div id="chat-mx-body" style="display:none">`
	HTML += `	<div class="minimize">&#128469;</div>`
	HTML += `	<div class="close">&#10005;</div>`
	HTML += `	<div class="content">`
	HTML += `	</div>`
	HTML += `</div>`
	HTML += `<div id="chatMX_button"><div class='baloom'>chat<b>MX</b></div><div id="notify"><span></span></div></div>`
	
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
			_('#chat-mx-body .content').innerHTML = `<iframe id="chatmx" src="chat.html?iframe&nome=${props.nome}&email=${props.email}&id=${props.idUser}&${new Date().getTime()}"></iframe>`
		}else{
			document.getElementById('chatmx').contentWindow.maximize();
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
		document.getElementById('chatmx').contentWindow.minimize();
		j('#chat-mx-body').hide(400)
		j('#chatMX_button').show(400)
	})

	_('#chat-mx-body .close').addEventListener("click", ()=>{
		startChat = 0
		document.getElementById('chatmx').contentWindow.fechar()
		
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
	document.getElementById('chatmx').contentWindow.setLido()
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