const upload = require('./upload');
const sampleClient = require('./sampleclient');
const {google} = require('googleapis');
const express = require('express');
var app = express();


app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
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
            res.redirect(url);
        })
        //.then(() => upload.runSample(fileName))
        //.catch(console.error);
    //res.send('Probando!');
});

app.get('/oauth2callback', async (req, res) => {
    console.log("ME LLEGO ALGOOOO12")
    //res.send('Probando!');
    console.log("EL REQ TIENE:",req.query.code);
    const clientWithCredentials = await sampleClient.clientWithCredentials(req.query.code);
    const youtube = await google.youtube({
        version: 'v3',
        auth: clientWithCredentials,
      });
      upload.runSample(youtube, fileName)
      //console.log("EL RES TIENE:",res);

      //if (req.url.indexOf('/oauth2callback') > -1) {
        //         const qs = new url.URL(req.url, 'http://localhost:8080')
        //           .searchParams;
        //         res.end(
        //           'Authentication successful! Please return to the console.'
        //         );
        //         server.destroy();
                 //const {tokens} = await this.oAuth2Client.getToken(res.get('code'));
        //         this.oAuth2Client.credentials = tokens;
        //         resolve(this.oAuth2Client);
        //         console.log("EL RESPONSE TIENE:",res)
        //         console.log("EL refresh_token TIENE:",res.refresh_token)              
        //       }
        //     } catch (e) {
        //       reject(e);
        //     }

    //upload.runSample(youtube,fileName)
    /*sampleClient
        .authenticate(scopes)
        .then(url => {

        })
        .then(() => upload.runSample(fileName))
        .catch(console.error);*/
    res.send('Probando!');
});

console.log("amigo", process.argv)