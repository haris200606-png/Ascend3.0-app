const XP_PER_LEVEL = 10;

let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  xpHistory:[0,1,2,3,4,3,5],
  calories:[1800,2000,1900,2100,1800,2200,2000],
  tasks:[
    {name:"Make bed",xp:1},
    {name:"Walk 5k steps",xp:2},
    {name:"Read 30 min",xp:2}
  ],
  notes:[]
};

function go(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="stats") drawCharts();
}

function renderTasks(){
  taskList.innerHTML="";
  state.tasks.forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.name} (+${t.xp})`;
    b.onclick=()=>gainXP(t.xp);
    taskList.appendChild(b);
  });
}

function gainXP(x){
  state.xp+=x;
  state.xpHistory.push(x);
  state.xpHistory=state.xpHistory.slice(-7);

  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
    levelUpText.classList.remove("hidden");
    setTimeout(()=>levelUpText.classList.add("hidden"),2000);
  }
  save();
}

function sendChat(){
  if(!chatInput.value) return;
  chatBox.innerHTML+=`<p>You: ${chatInput.value}</p>`;
  chatBox.innerHTML+=`<p>AI: You're level ${state.level} with a ${state.streak} day streak. Stay sharp.</p>`;
  chatInput.value="";
  chatBox.scrollTop=9999;
}

function analyzeFood(){
  foodResult.innerText="📸 AI estimates: 420 calories, 35g protein";
  state.calories.push(420);
  state.calories=state.calories.slice(-7);
  gainXP(2);
}

function addNote(){
  if(!noteInput.value) return;
  state.notes.unshift(noteInput.value);
  noteInput.value="";
  save();
}

function renderNotes(){
  notesList.innerHTML="";
  state.notes.forEach(n=>{
    const d=document.createElement("div");
    d.className="note-card";
    d.innerText=n;
    notesList.appendChild(d);
  });
}

function drawCharts(){
  drawLine(xpChart,state.xpHistory,"XP");
  drawLine(calChart,state.calories,"Calories");
}

function drawLine(canvas,data,label){
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#facc15";
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x=i*(canvas.width/(data.length-1));
    const y=canvas.height-(v/Math.max(...data))*canvas.height;
    if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

function updateUI(){
  username.innerText=state.name;
  level.innerText=state.level;
  xpFill.style.width=`${(state.xp/XP_PER_LEVEL)*100}%`;
  streak.innerText=`🔥 ${state.streak} day streak`;
  profileFrame.className="profile-frame "+(
    state.level>=20?"platinum":
    state.level>=10?"gold":
    state.level>=5?"silver":"bronze"
  );
  renderTasks();
  renderNotes();
}

updateUI();
