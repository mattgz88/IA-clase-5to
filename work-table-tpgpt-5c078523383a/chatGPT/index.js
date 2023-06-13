//Importamos Modulos
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const openAI = require("openai");
const morgan = require("morgan");
const path = require("path");


// Importamos dotenv para acceder a variables de entorno
require("dotenv").config();

const app = express();
const port = 3000;

//Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* MIDDLEWARES */
app.use(morgan("dev"));
app.use(express.json());
//Configurando archivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Importamos y configuramos el cliente OpenAI API
const { Configuration, OpenAIApi } = require("openai");
// Acceder al token en el archivo .env
const configuration = new Configuration({
	apiKey: process.env.TOKEN,
});
const openai = new OpenAIApi(configuration);


//Variables para la configuracion de la respuesta
let temperature = 0.9;
let maxTokens = 150;
let model = ["text-davinci-003","gpt-3.5-turbo","texto-davinci-002"];
let modelNum = 0;

app.get('/', (req, res) => {
    res.render('main', {temperature: temperature, maxTokens: maxTokens});
});

app.post('/config', (req, res) => {
    temperature = req.body.temperature;
	maxTokens = req.body.maxTokens;
	modelNum = Number(req.body.modelNum);
	console.log(modelNum + " " + temperature + " " + maxTokens);
	res.status(200).send('Configuracion exitosa');
});

// Defining an endpoint to handle incoming requests
app.post("/message", (req, res) => {

	// Extracting the user's message from the request body
	const message = req.body.text;
	
	console.log(message); //comprobar entrada

	// LLamando a la API de OpenAI
	openai
		.createCompletion({
			model: model[modelNum],
			// Agregamos a la conversación el mesansaje en cuestión
			prompt: message,
			temperature: temperature,
			max_tokens: maxTokens,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0.6,
			stop: [" Human:", " AI:"],
		})
		.then((response) => {
			// Sending the response data back to the client
			res.send(response.data.choices[0].text.replace(/^\s+/, '')); //solo envia texto
			console.log(response.data.choices); //comprobar salida
		});
});

// Escuchamos en el puerto correspondiente
app.listen(port, () => {
	console.log("Chatbot escuchando en el puerto " + port);
});
