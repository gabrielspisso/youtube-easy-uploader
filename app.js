const upload = require('./upload');
const sampleClient = require('./sampleclient');
const express = require('express');
var app = express();


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
];

const fileName = process.argv[2];



app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/prueba', function (req, res) {
    sampleClient
        .authenticate(scopes)
        .then(url => {

        })
        .then(() => upload.runSample(fileName))
        .catch(console.error);
    res.send('Probando!');
});

app.get('/oauth2callback', function (req, res) {
    sampleClient
        .authenticate(scopes)
        .then(url => {

        })
        .then(() => upload.runSample(fileName))
        .catch(console.error);
    res.send('Probando!');
});

console.log("amigo", process.argv)