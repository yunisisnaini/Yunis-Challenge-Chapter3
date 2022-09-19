const HTTP = require('http');
const FS = require('fs');
const PATH = require('path');
const URL = require('url');
const { url } = require('inspector');
const directoryName = './public';
const port = 3000;

const types = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    woff:'font/woff',
    woff2:'font/woff2',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    json: 'application/json',
    xml: 'application/xml',
  };

  const root = PATH.normalize(PATH.resolve(directoryName));

  const server = HTTP.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
  
    const extension = PATH.extname(req.url).slice(1);
    const type = extension ? types[extension] : types.html;
    const supportedExtension = Boolean(type);
  
    if (!supportedExtension) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
      return;
    }
  
    let fileName = req.url;
    if (req.url === '/') fileName = 'index.html';
    else if (!extension) {
      try {
        FS.accessSync(PATH.join(root, req.url + '.html'), FS.constants.F_OK);
        fileName = req.url + '.html';
      } catch (e) {
        fileName = PATH.join(req.url, 'index.html');
      }
    }

    // if(req.url){
    //   console.log(req.data)
    //   res.writeHead(200);
    //   res.end(req.data);
    // }

    const queryObject = URL.parse(req.url, true).query;
    console.log(queryObject);
  
    const filePath = PATH.join(root, fileName);
    const isPathUnderRoot = PATH.normalize(PATH.resolve(filePath)).startsWith(root);
  
    if (!isPathUnderRoot) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
      return;
    }
  
    FS.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404: File not found');
      } else {
        res.writeHead(200, { 'Content-Type': type });
        res.end(data);
      }
    });
  });
  
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });