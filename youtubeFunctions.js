'use strict';

const fs = require('fs');
const readline = require('readline');

async function upload({youtube, fileName, title, description, privacy}) {
  if (!fs.existsSync(fileName)) {
    throw new Error("Can't resolve for file: ",fileName);
  }
  const fileSize = fs.statSync(fileName).size;
  return await youtube.videos.insert(
    {
      part: 'id,snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: title,
          description: description,
        },
        status: {
          privacyStatus: privacy,
        },
      },
      media: {
        body: fs.createReadStream(fileName),
      },
    },
    {
      // Use the `onUploadProgress` event from Axios to track the
      // number of bytes uploaded to this point.
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSize) * 100;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(`${Math.round(progress)}% complete`);
      },
    }
  )
}

module.exports = {
  upload
};