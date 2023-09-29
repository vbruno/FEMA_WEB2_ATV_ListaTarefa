import { Router } from "express";
import { randomUUID } from "node:crypto";

import { Database } from "../database.js";

export const taskRoute = Router();

const database = new Database();

// CRUD de gerenciamento de tarefas para um usuário especifico 

// Rota para listar todas as tarefas
taskRoute.get("/getAll", (request, response) => {
  const data = database.select("task");

  response.json(data);
});

// Rota para listar uma tarefa especifica
taskRoute.get("/:id", (request, response) => {
  const { id } = request.params;

  const data = database.select("task", id);

  if (data.length === 0) {
    response.status(404).send("Tarefa não encontrada");
  } else {
    response.json(data);
  }
});

// Rota para criar uma tarefa
taskRoute.post("/create", (request, response) => {
  const {
    user_id,
    title,
    description,
  } = request.body;

  const msg = JSON.stringify(request.body);
  
  if (msg.length > 2) {

    //verificar de o usuário existe
    const user = database.select("user", user_id);
    if (user.length === 0) {
      response.status(404).send("Usuário não encontrado");
      return;
    }

    database.insert("task", {
      id: randomUUID(),
      user_id: user_id,
      title,
      description,
      isConcluded: false,
      created_at: new Date(),
      updated_at: null,
    });

    response.status(201).json({ msg: "Arquivo salvo com sucesso!" });
  } else {
    response.status(400).send("Rota sem body ou sem conteúdo");
  }
});

// Rota para deletar uma tarefa
taskRoute.delete("/:id", (request, response) => {
  const { id } = request.params;
  const {
    user_id,
    title,
    description,
  } = request.body;

  const result = database.delete("task", id);

  if (!result.error) {
    response.status(202).json(result);
  } else {
    response.status(404).json(result);
  }
});

// Rota para atualizar uma tarefa
taskRoute.put("/:id", (request, response) => {
  const {
    title,
    description,
    isConcluded
  } = request.body;

  const { id } = request.params;

  const task = database.select("task", id);

  const result = database.update("task", id, {
    title: title ?? task.title,
    description: description ?? task.description,
    isConcluded: isConcluded ?? task.isConcluded,
    created_at: task.created_at,
    updated_at: new Date(),
  });

  if (!result.error) {
    response.status(202).json(result);
  } else {
    response.status(404).json(result);
  }
});

// Rota para marca um tarefa como concluída
taskRoute.put("/conclude/:id", (request, response) => {
  const { id } = request.params;

  const task = database.select("task", id);

  const result = database.update("task", id, { 
    title: task.title,
    description: task.description,
    isConcluded: true,
    created_at: task.created_at,
    updated_at: new Date(),
  });

  if (!result.error) {
    response.status(202).json(result);
  } else {
    response.status(404).json(result);
  }
} );


