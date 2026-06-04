const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const buildDir = path.join(__dirname, 'build');

const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(buildDir, urlPath === '/' ? 'index.html' : urlPath);
  const safePath = filePath.startsWith(buildDir) ? filePath : path.join(buildDir, 'index.html');

  fs.readFile(safePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(buildDir, 'index.html'), (indexError, indexContent) => {
        if (indexError) {
          res.writeHead(404);
          return res.end('Not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      });
      return;
    }

    res.writeHead(200, { 'Content-Type': types[path.extname(safePath)] || 'text/plain' });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Cyramik frontend running at http://localhost:${port}`);
});
