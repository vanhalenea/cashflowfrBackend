
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(require('./routes/index-routes'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true,useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Conectado a mongo ok');
});
app.listen(process.env.PORT, () => {
    console.log(`Escucnadho puerto ${process.env.PORT} ...`);
});