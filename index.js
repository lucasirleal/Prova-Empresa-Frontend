const express = require("express");
const path = require("path");
const favicon = require('serve-favicon');
const axios = require('axios');
const bodyParser = require('body-parser')

const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(favicon(path.join(__dirname, 'public', 'imgs', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => {
  res.render("index");
});

// Receive calls to process the requests for calculations.
app.post('/simular', (req, res) => {

  var received = JSON.parse(req.body.data);
  const needed_keys = ['valor_emprestimo', 'instituicoes', 'convenios', 'parcelas'];
  console.log(received);
  if (!needed_keys.every(key => Object.keys(received).includes(key))) {
    res.statusCode = 400;
    res.statusMessage = "Valores informados incorretamente.";
    res.end();
  } else {
    axios
      .post('http://127.0.0.1:8000/api/simular', received)
      .then(response => {

        //Adding back the value the client asked for.
        response.data["valor_emprestimo"] = received.valor_emprestimo;

        res.statusCode = 200;
        res.write(JSON.stringify(response.data));
        res.end();
      })
      .catch(error => {
        console.log(error);
        res.statusCode = 400;
        res.statusMessage = error;
        res.end();
      }) 
  }
});

// Receive calls to process the requests for "convenios".
app.get('/convenios', (req, res) => {
  axios
    .get('http://127.0.0.1:8000/api/convenio')
    .then(response => {
      res.statusCode = 200;
      res.json(response.data);
      res.end();
    })
    .catch(error => {
      console.log(error);
      res.statusCode = 400;
      res.statusMessage = error;
      res.end();
    });
});

// Receive calls to process the requests for "instituicoes".
app.get('/instituicoes', (req, res) => {
  axios
    .get('http://127.0.0.1:8000/api/instituicao')
    .then(response => {
      res.statusCode = 200;
      res.json(response.data);
      res.end();
    })
    .catch(error => {
      console.log(error);
      res.statusCode = 400;
      res.statusMessage = error;
      res.end();
    });
});

app.use("/", router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);

console.log("Página iniciada na porta 3000.");