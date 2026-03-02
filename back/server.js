const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { validerTitre, formaterTache } = require("./src/utils");

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(express.json());

function chargerTaches() {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      fs.writeFileSync(TASKS_FILE, "[]");
    }
    const data = fs.readFileSync(TASKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function sauvegarderTaches(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

let tasks = chargerTaches();

app.get("/", (req, res) => {
  res.json({
    message: "API de gestion de taches - operationnelle",
    version: "1.0.0",
    routes: [
      { methode: "GET",    url: "/",          description: "Informations sur l'API" },
      { methode: "GET",    url: "/tasks",     description: "Recuperer toutes les taches" },
      { methode: "POST",   url: "/tasks",     description: "Creer une nouvelle tache" },
      { methode: "PUT",    url: "/tasks/:id", description: "Modifier une tache existante" },
      { methode: "DELETE", url: "/tasks/:id", description: "Supprimer une tache" },
    ],
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!validerTitre(title)) {
    return res.status(400).json({ error: "Le titre est requis" });
  }

  const id = Date.now();
  const task = formaterTache(id, title);
  tasks.unshift(task);
  sauvegarderTaches(tasks);
  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tache non trouvee" });
  }

  const { title, done } = req.body;

  if (!validerTitre(title)) {
    return res.status(400).json({ error: "Le titre est requis" });
  }

  tasks[index] = formaterTache(id, title, done);
  sauvegarderTaches(tasks);
  res.json(tasks[index]);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tache non trouvee" });
  }

  tasks.splice(index, 1);
  sauvegarderTaches(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log("================================");
  console.log("  API Tasks - En ligne !");
  console.log(`  http://localhost:${PORT}`);
  console.log("================================");
  console.log(`  GET  /         -> infos API`);
  console.log(`  GET  /tasks    -> liste des taches`);
  console.log(`  POST /tasks    -> creer une tache`);
  console.log("================================");
});
