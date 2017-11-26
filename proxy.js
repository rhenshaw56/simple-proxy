const http = require('http');
const url = require('url');

const notFound = response => {
   response.writeHead(404, 'text/plain');
   response.end('404: File not found');

} 

const server = http.createServer((b_req, b_resp) => {
    // parse the request url
    const b_url = url.parse(b_req.url, true);

    // check that request url params are not empty
    if(!b_url.query || !b_url.query.url) {
        return notFound(b_resp);
    }

    // Read and parse the url params ie. (/?url=p_url)
    const p_url = url.parse(b_url.query.url);

    // create http client that actually makes the remote request
    const options = {
        port: p_url.port || 80,
        hostname: p_url.hostname,
        method: 'GET',
        path: p_url.pathname
      };

    // send request
    const p_req = http.request(options);

    p_req.end();

    // Listen for response
    p_req.addListener('response', p_resp => {
        // pass response headers to your home browser 
        b_resp.writeHead(p_resp.statusCode, p_resp.headers);

        // pass data on
        p_resp.addListener('data', data => {
            b_resp.write(data);
        });

        // end connection
        p_resp.addListener('end', () => {
            b_resp.end();
        });
    });
});

server.listen(3000, '127.0.0.1');

console.log('Server running on http://127.0.0.1:3000');

