import express from "express";

import { router } from "./routers/index.js";

const server = express();
const port = 3333;

server.use(express.json());

server.use((request, response, next) => {
  console.log(
    `[${new Date().toISOString()}] - ${request.socket.remoteAddress} - ${
      request.method
    } - ${request.originalUrl}`
  );

  next();
});

server.use(router);

server.use((request, response, next) => {
  response
    .status(404)
    .json({ error: true, message: "Erro ao acessar a rota!" });
});

server.listen(port, () => {
  console.log(`🚀 Servidor em funcionamento!!! - http://localhost:${port}`);
});
