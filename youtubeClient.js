'use strict';

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'oauth2.keys.json');
if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
}

class YoutubeClient {
  constructor(credentials) {

    if (!fs.existsSync(credentials)) {
      console.log("CREDENTIALS: ",credentials)
      throw new Error("Can't resolve for file: ", credentials);
    }
    const keyFile = require(credentials);
    const keys = keyFile.installed || keyFile.web;
    const redirectUri = keys.redirect_uris.find(url => url.includes("oauth2callback"))
    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    );

    this.oAuth2Client.on('tokens', (tokens) => {
      console.log("Se agregan tokens:", tokens);
    });

  }

  async CreateClientByRefreshToken(refresh_token) {
    this.oAuth2Client.setCredentials({
      refresh_token: refresh_token
    });
    return await google.youtube({
      version: 'v3',
      auth: this.oAuth2Client,
    });
  }

  async CreateClientByOAuth2(code) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    return await google.youtube({
      version: 'v3',
      auth: this.oAuth2Client,
    });
  }

  
  async authenticate() {
    return new Promise((resolve, reject) => {
      
      const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
      ];

      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });
      console.log(this.authorizeUrl)
      resolve(this.authorizeUrl)
    });
  }
}
// [END auth_oauth2_workflow]
module.exports = YoutubeClient;