const XP_PER_LEVEL = 10;

let state = JSON.parse(localStorage.getItem("ascend")) || {
  name: "You",
  level: 1,
  xp: 0,
  streak: 1,
  tasks: [
    { name: "Make bed", xp: 1, enabled: true },
    { name: "Walk 5k steps", xp: 2, enabled: true },
    { name: "Read 30 pages", xp: 3, enabled: false }
  ],
  notes: []
};

function save() {
  localStorage.setItem("ascend", JSON.stringify(state));
  updateUI();
}

function go(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}

function gainXP(xp) {
  state.xp += xp;
  if (state.xp >= XP_PER_LEVEL) {
    state.xp -= XP_PER_LEVEL;
    state.level++;
  }
  save();
}

function renderTasks() {
  taskList.innerHTML = "";
  state.tasks.filter(t => t.enabled).forEach(t => {
    const b = document.createElement("button");
    b.textContent = `${t.name} (+${t.xp})`;
    b.onclick = () => gainXP(t.xp);
    taskList.appendChild(b);
  });
}

function renderLibrary() {
  taskLibrary.innerHTML = "";
  state.tasks.forEach(t => {
    const b = document.createElement("button");
    b.textContent = `${t.enabled ? "✓ " : ""}${t.name}`;
    b.onclick = () => { t.enabled = !t.enabled; save(); };
    taskLibrary.appendChild(b);
  });
}

function addNote() {
  if (!noteInput.value) return;
  state.notes.unshift(noteInput.value);
  noteInput.value = "";
  save();
}

function renderNotes() {
  notesList.innerHTML = "";
  state.notes.forEach(n => {
    const d = document.createElement("div");
    d.className = "card";
    d.textContent = n;
    notesList.appendChild(d);
  });
}

function sendChat() {
  const msg = chatInput.value;
  if (!msg) return;
  chatBox.innerHTML += `<p>You: ${msg}</p><p>AI: Stay consistent.</p>`;
  chatInput.value = "";
}

function addMeal() {
  alert("Food AI coming next 🔥");
}

function saveName() {
  state.name = nameInput.value || state.name;
  save();
}

function updateUI() {
  username.textContent = state.name;
  level.textContent = state.level;
  xpFill.style.width = `${(state.xp / XP_PER_LEVEL) * 100}%`;
  streak.textContent = `🔥 ${state.streak} day streak`;
  renderTasks();
  renderLibrary();
  renderNotes();
}

updateUI();
