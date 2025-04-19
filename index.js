// proxy-server.ts
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// /api → NestJS 백엔드 (3000)
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:3000/api",
    changeOrigin: true,
  })
);

// 나머지 → 프론트엔드 (5173)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
  })
);

app.listen(8080, () => {
  console.log("🔥 Proxy server running at http://localhost:8080");
});
