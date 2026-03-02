function validerTitre(title) {
  return typeof title === "string" && title.trim().length > 0;
}

function formaterTache(id, title, done = false) {
  return {
    id,
    title: title.trim(),
    done: Boolean(done),
  };
}

function compterTachesTerminees(tasks) {
  return tasks.filter((t) => t.done).length;
}

function filtrerParEtat(tasks, done) {
  return tasks.filter((t) => t.done === done);
}

module.exports = { validerTitre, formaterTache, compterTachesTerminees, filtrerParEtat };
