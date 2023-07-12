const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const requestHandler = (clientReq, clientRes) => {
  const { method, headers } = clientReq;
  const targetUrl = url.parse(clientReq.url);

  // Create options object for the target server request
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.path,
    method,
    headers,
  };

  // Choose http or https module based on the target URL
  const proxy = targetUrl.protocol === 'https:' ? https : http;

  // Send the client request to the target server
  const proxyReq = proxy.request(options, (proxyRes) => {
    // Forward the target server response to the client
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  // Pipe the client request body to the target server request
  clientReq.pipe(proxyReq);
};

// Create the proxy server
const server = http.createServer(requestHandler);

// Start listening on the specified port
server.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
