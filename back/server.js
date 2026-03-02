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
  console.log(`Serveur demarre sur le port ${PORT}`);
});
