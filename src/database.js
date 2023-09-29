import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.database = JSON.parse(data);
      })
      .catch(() => {
        this.persist();
      });
  }

  persist() {
    fs.writeFile(databasePath, JSON.stringify(this.database, null, 2));
  }

  select(table, search = "") {
    const data = this.database[table] ?? [];

    if (search) {
      const searchUppercase = search.toUpperCase().trim();

      console.log(searchUppercase);

      const result = data.find((item) => {
        return item.id.toUpperCase().trim() === searchUppercase;
      });

      if (result) {
        return result;
      } else {
        return { msg: "Não foi encontrado ninguem!" };
      }
    } else {
      return data;
    }
  }

  insert(table, data) {
    if (Array.isArray(this.database[table])) {
      this.database[table].push(data);
    } else {
      this.database[table] = [data];
    }
    this.persist();

    return data;
  }

  delete(table, id) {
    console.log(id);

    const rowIndex = this.database[table].findIndex((row) => {
      return row.id === id;
    });

    console.log(rowIndex);

    if (rowIndex > -1) {
      this.database[table].splice(rowIndex, 1);
      this.persist();

      return { error: false, message: "Removido registro com sucesso!" };
    } else {
      return { error: true, message: "Falha na remoção do registro" };
    }
  }

  update(table, id, data) {
    const rowIndex = this.database[table].findIndex((row) => {
      return row.id === id;
    });

    if (rowIndex > -1) {
      this.database[table][rowIndex] = { id, ...data };

      this.persist();

      return { error: false, message: "Alterado registro com sucesso!!" };
    } else {
      return { error: true, message: "Falha na alteração do registro" };
    }
  }
}
