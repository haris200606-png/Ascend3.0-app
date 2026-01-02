/* ---------- STATE ---------- */
const XP_PER_LEVEL = 10;

let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  aiMode:"motivational",
  tasks:[],
  nutritionLog:[],
  notes:[]
};

/* ---------- TASKS (FOUNDATION) ---------- */
const TASK_POOL = [
  {name:"Make bed",xp:1},
  {name:"Drink 2L water",xp:2},
  {name:"Walk 5k steps",xp:2},
  {name:"Workout",xp:4},
  {name:"Stretch",xp:1},
  {name:"Read 30 minutes",xp:3},
  {name:"Study 1 hour",xp:4},
  {name:"Journal",xp:2},
  {name:"Meditate",xp:2},
  {name:"No junk food",xp:3},
  {name:"Sleep before 11pm",xp:2},
  {name:"Wake before 7am",xp:2}
];

if(state.tasks.length === 0){
  state.tasks = TASK_POOL.map(t=>({...t,enabled:false}));
}

/* ---------- NAV ---------- */
function go(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- TASKS ---------- */
function renderTasks(){
  taskList.innerHTML="";
  state.tasks.filter(t=>t.enabled).forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.name} (+${t.xp})`;
    b.onclick=()=>completeTask(t);
    taskList.appendChild(b);
  });
}

function renderLibrary(){
  taskLibrary.innerHTML="";
  state.tasks.forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.enabled?"✓ ":""}${t.name}`;
    b.onclick=()=>{
      t.enabled=!t.enabled;
      save();
    };
    taskLibrary.appendChild(b);
  });
}

function completeTask(task){
  const today=new Date().toDateString();
  if(state.lastDay!==today){
    state.streak++;
    state.lastDay=today;
  }

  state.xp+=task.xp;

  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
    alert("LEVEL UP!");
  }

  save();
}

/* ---------- AI ---------- */
function aiCoach(){
  if(state.aiMode==="silent") return;
  alert(`Level ${state.level}. Streak: ${state.streak} days. Keep going.`);
}

function sendChat(){
  const msg=chatInput.value;
  if(!msg) return;
  chatBox.innerHTML+=`<p>You: ${msg}</p>`;
  chatBox.innerHTML+=`<p>AI: Consistency beats intensity.</p>`;
  chatInput.value="";
}

/* ---------- NUTRITION ---------- */
function saveNutrition(){
  state.nutritionLog.push({
    date:new Date().toDateString(),
    calories:+calories.value||0,
    protein:+protein.value||0,
    carbs:+carbs.value||0,
    fats:+fats.value||0
  });
  nutritionSummary.innerText="Saved!";
  calories.value=protein.value=carbs.value=fats.value="";
  save();
}

/* ---------- NOTES ---------- */
function addNote(){
  if(!noteInput.value) return;
  state.notes.unshift({text:noteInput.value,date:new Date().toLocaleString()});
  noteInput.value="";
  save();
}

function renderNotes(){
  notesList.innerHTML="";
  state.notes.forEach(n=>{
    const d=document.createElement("div");
    d.className="note-card";
    d.innerHTML=`<p>${n.text}</p><small>${n.date}</small>`;
    notesList.appendChild(d);
  });
}

/* ---------- SETTINGS ---------- */
function saveName(){
  state.name=nameInput.value||state.name;
  save();
}
function setAI(m){ state.aiMode=m; save(); }

/* ---------- SAVE ---------- */
function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

function updateUI(){
  username.innerText=state.name;
  level.innerText=state.level;
  xpFill.style.width=`${(state.xp/XP_PER_LEVEL)*100}%`;
  streak.innerText=`🔥 ${state.streak} day streak`;

  profileFrame.className="profile-frame " +
    (state.level>=20?"platinum":state.level>=10?"gold":state.level>=5?"silver":"bronze");

  renderTasks();
  renderLibrary();
  renderNotes();
}

updateUI();
