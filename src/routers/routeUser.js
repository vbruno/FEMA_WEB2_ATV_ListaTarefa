import { Router } from "express";
import { randomUUID } from "node:crypto";

import { Database } from "../database.js";

const userRoute = Router();

const database = new Database();

// Cria um CRUD para Usuário

// Rota para listar todos os usuários
userRoute.get("/getAll", (request, response) => {
  const data = database.select("user");

  response.json(data);
});

// Rota para listar um usuário
userRoute.get("/:id", (request, response) => {
  const { id } = request.params;

  const data = database.select("user", id);

  response.json(data);
});


// Rota para criar um usuário
userRoute.post("/create", (request, response) => {
  const requestBody = request.body;

  const msg = JSON.stringify(requestBody);
  
  if (msg.length > 2) {
    database.insert("user", {
      id: randomUUID(),
      name: requestBody.name,
      estado: "ativo"
    });

    response.status(201).json({ msg: "Arquivo salvo com sucesso!" });
  } else {
    response.status(400).send("Rota sem body ou sem conteúdo");
  }
});
// Rota para deletar um usuário
userRoute.delete("/:id", (request, response) => {
  const { id } = request.params;

  const result = database.delete("user", id);

  if (!result.error) {
    response.status(202).json(result);
  } else {
    response.status(404).json(result);
  }
});

// Rota para atualizar um usuário
userRoute.put("/:id", (request, response) => {
  const { id } = request.params;

  const requestBody = request.body;

  const result = database.update("user", id, requestBody);

  if (!result.error) {
    response.status(202).json(result);
  } else {
    response.status(404).json(result);
  }
});


export { userRoute };
