import http from 'http';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import chatServer from './lib/chat_server';

let cache = {};

function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    { 'Content-Type': mime.lookup(path.basename(filePath)) }
  );
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if(cache[absPath]) return sendFile(response, absPath, cache[absPath]);

  fs.exists(absPath, (exists) => {
    if(exists) {
      fs.readFile(absPath, (err, data) => {
        if(err) {
          send404(response);
        } else {
          cache[absPath] = data;
          sendFile(response, absPath, data)
        }
      });
    } else {
      send404(response)
    }
  });
}

const server = http.createServer((request, response) => {
  let filePath = () => {
    if(request.url == '/') {
      return 'public/index.html';
    } else {
      return `public/${request.url}`;
    }
  }()

  serveStatic(response, cache, `./${filePath}`)
});

server.listen(3000, () => {
  console.log('Server listening on port 3000.');
});

chatServer.listen(server);
