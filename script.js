var stuff = JSON.parse(localStorage.getItem("tasks")) || [];
var energy = true;
var intvl;
var mins = energy ? 90 : 30;
var finishTime;

var list = document.getElementById("taskList");
var stat = document.getElementById("cycleStatus");
var timer = document.getElementById("countdown");
var sug = document.getElementById("suggestedTask");

function makeTask() {
  var n = document.getElementById("taskName").value.trim();
  var diff = document.getElementById("difficulty").value;
  var ddl = document.getElementById("deadline").value;
  var pri = document.getElementById("priority").value;

  if (n == "" || ddl == "") {
    alert("fill task and date");
    return;
  }

  var obj = {
    name: n,
    difficulty: diff,
    deadline: ddl,
    priority: pri,
    when: new Date().toISOString(),
  };

  stuff.push(obj);
  localStorage.setItem("tasks", JSON.stringify(stuff));
  showTasks();
  pick();
  emptyFields();
}

function emptyFields() {
  document.getElementById("taskName").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("difficulty").value = "low";
  document.getElementById("priority").value = "normal";
}

function showTasks() {
  list.innerHTML = "";

  stuff.sort(function (a, b) {
    if (a.priority == b.priority) {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return a.priority == "urgent" ? -1 : 1;
  });

  for (let z = 0; z < stuff.length; z++) {
    let t = stuff[z];
    let x = document.createElement("li");
    x.innerHTML = `
      <div>
        <b>${t.name}</b>
        <div class="meta">Diff: ${t.difficulty} | Due: ${new Date(
      t.deadline
    ).toLocaleString()} | Pri: ${t.priority}</div>
      </div>
      <button onclick="removeTask(${z})">🗑️</button>
    `;
    list.appendChild(x);
  }
}

function removeTask(i) {
  stuff.splice(i, 1);
  localStorage.setItem("tasks", JSON.stringify(stuff));
  showTasks();
  pick();
}

function pick() {
  var rn = new Date();
  var ok = stuff.filter(function (task) {
    var d = new Date(task.deadline);
    if (d < rn) return false;
    if (energy) {
      return task.difficulty != "low";
    } else {
      return task.difficulty == "low";
    }
  });

  if (ok.length > 0) {
    sug.textContent = ok[0].name;
  } else {
    if (energy) {
      sug.textContent = "Do tough job or big idea work!";
    } else {
      sug.textContent = "Chill, plan or clean inbox.";
    }
  }
}

function go() {
  energy = !energy;
  mins = energy ? 90 : 30;
  var now = new Date();
  finishTime = new Date(now.getTime() + mins * 60 * 1000);

  changeStatus();
  pick();

  if (intvl) clearInterval(intvl);

  intvl = setInterval(function () {
    var now2 = new Date();
    var left = finishTime - now2;

    if (left <= 0) {
      clearInterval(intvl);
      go();
    } else {
      showTime(left);
    }
  }, 1000);
}

function showTime(d) {
  var s = Math.floor(d / 1000);
  var m = Math.floor(s / 60);
  var r = s % 60;

  timer.textContent = `${m.toString().padStart(2, "0")}:${r
    .toString()
    .padStart(2, "0")}`;
}

function changeStatus() {
  stat.textContent = energy ? "High Energy 🔥" : "Low Energy 🌙";
}

function start() {
  showTasks();
  pick();
  go();
}

start();
