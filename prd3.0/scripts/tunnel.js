const http = require('http');
const https = require('https');

// Simple reverse proxy to localhost:3000
const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: 'localhost:3000' }
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxy);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});

// Use localtunnel
const { exec } = require('child_process');
const lt = exec(`npx localtunnel --port ${PORT}`, { cwd: __dirname + '/..' });

lt.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  const match = output.match(/your url is: (https:\/\/[^\s]+)/);
  if (match) {
    console.log('\n============ 可分享链接 ============');
    console.log(match[1]);
    console.log('注意: 首次访问需要输入你的公网 IP 作为密码');
    console.log('====================================\n');
  }
});

lt.stderr.on('data', (data) => console.error(data.toString()));

process.on('SIGINT', () => {
  lt.kill();
  server.close();
  process.exit();
});
