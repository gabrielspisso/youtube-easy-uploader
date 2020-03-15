const YoutubeClient = require('./youtubeClient');
const youtubeFunctions = require('./youtubeFunctions');
const express = require('express');
var app = express();

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

const credentials = process.argv[2];
const refresh_token = process.argv[3];
const fileName = process.argv[4];
const title = process.argv[5] || "Test title";
const description = process.argv[6] || "Test description";
const privacy = process.argv[7] || "public";
const youtubeClient = new YoutubeClient(credentials);

app.get('/', function (req, res) {
    res.send('Hello World!');
});

let videoUploadOnCourse = false;

app.get('/upload', function (req, res) {
    if (refresh_token == "") {
        youtubeClient.authenticate()
            .then(url => {
                res.redirect(url);
            })
            .then(() => {
                videoUploadOnCourse = true;
                console.log("The process will end in 30 seconds if you dont autenticate")
                setTimeout(() => {
                    if (videoUploadOnCourse)
                        process.exit()
                }, 30000);
            })
    }
    else {
        uploadByRefreshToken();
        res.send('Uploading with refresh token');
    }
});

const uploadVideo = (youtube) => {
    youtubeFunctions.upload({
        youtube: youtube,
        fileName: fileName,
        title: title,
        description: description,
        privacy: privacy
    })
    .catch(e => console.log("Hubo un error en la subida:",e))
    .then(res => console.log("Se subio correctamente, el resultado fue: ",res.data))
}

const uploadByRefreshToken = async () => {
    const youtube = await youtubeClient.CreateClientByRefreshToken(refresh_token);
    uploadVideo(youtube);
}

app.get('/oauth2callback', async (req, res) => {
    const youtube = await youtubeClient.CreateClientByOAuth2(req.query.code);
    videoUploadOnCourse = false;
    uploadVideo(youtube)
    res.send('Uploading with oauth login');
});