// 프로모션 기획 연습장 — Railway용 정적 서버 (외부 패키지 없음)
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const PAGE = path.join(__dirname, "index.html");

// 시작할 때 한 번 읽어 메모리에 둔다 (파일이 하나뿐이라 가장 빠르고 단순함)
const html = fs.readFileSync(PAGE);
const gz = zlib.gzipSync(html);
const br = zlib.brotliCompressSync(html);

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function sendPage(req, res) {
  const accept = req.headers["accept-encoding"] || "";
  let body = html;
  const headers = {
    ...SECURITY,
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
    Vary: "Accept-Encoding",
  };
  if (/\bbr\b/.test(accept)) {
    body = br;
    headers["Content-Encoding"] = "br";
  } else if (/\bgzip\b/.test(accept)) {
    body = gz;
    headers["Content-Encoding"] = "gzip";
  }
  headers["Content-Length"] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { ...SECURITY, Allow: "GET, HEAD" });
    return res.end();
  }
  const url = (req.url || "/").split("?")[0];
  if (url === "/health") {
    res.writeHead(200, { ...SECURITY, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(req.method === "HEAD" ? undefined : "ok");
  }
  if (url === "/favicon.ico") {
    res.writeHead(204, SECURITY);
    return res.end();
  }
  // 한 페이지 앱: 어떤 경로로 들어와도 같은 화면 (탭은 #glossary 같은 해시로 이동)
  sendPage(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`프로모션 기획 연습장: http://${HOST}:${PORT}`);
});

// Railway가 재배포할 때 보내는 종료 신호를 받아 깔끔하게 닫기
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
