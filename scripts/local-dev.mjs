import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.join(__dirname, "..", "frontend");
const BACKEND = "http://127.0.0.1:3000";
const PORT = 8080;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function serveStatic(req, res) {
  let filePath = path.join(FRONTEND, req.url === "/" ? "index.html" : req.url);
  if (!filePath.startsWith(FRONTEND)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "text/plain" });
    res.end(data);
  });
}

function proxyToBackend(req, res) {
  const target = new URL(req.url.replace(/^\/api/, "") || "/", BACKEND);
  const options = {
    hostname: target.hostname,
    port: target.port,
    path: target.pathname + target.search,
    method: req.method,
    headers: { ...req.headers, host: target.host },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => {
    res.writeHead(502);
    res.end(JSON.stringify({ detail: "Backend not running on port 3000" }));
  });

  req.pipe(proxyReq);
}

http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }
  if (req.url.startsWith("/api")) {
    proxyToBackend(req, res);
    return;
  }
  serveStatic(req, res);
}).listen(PORT, () => {
  console.log(`Frontend + API proxy: http://localhost:${PORT}`);
});
