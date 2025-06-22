document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'))

    if(storedTasks)
    {
        storedTasks.forEach((task)=> tasks.push(task))
        updateTasksList();
        updateStats();
    }
})

let tasks = []

let currentFilter = "all";
let currentSort = "newest";


const saveTasks = ()=> {
    localStorage.setItem('tasks',JSON.stringify(tasks))

}

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({
            text: text,
            completed: false,
            pinned: false,
            createdAt: new Date()
        });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.filters button[onclick*="${filter}"]`).classList.add("active");
    updateTasksList();
}


function sortTasks(order) {
    currentSort = order;
    updateTasksList();
}

function togglePin(index) {
    tasks[index].pinned = !tasks[index].pinned;
    updateTasksList();
    saveTasks();
}

const toggleTaskComplete = (index) =>{
    tasks[index].completed = !tasks[index].completed;
    console.log({tasks});
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index,1);
    updateTasksList();
    updateStats();
    saveTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value= tasks[index].text;

    tasks.splice(index,1);
    updateTasksList();
    updateStats();
    saveTasks();
}

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    const progressBar = document.getElementById("progress");

    if (totalTasks === 0) {
        progressBar.style.width = `0%`;
    } else {
        const progress = (completeTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
    }

    document.getElementById("numbers").innerText = `${completeTasks} / ${totalTasks}`;

    if (totalTasks > 0 && completeTasks === totalTasks) {
        blastConfetti();
    }
};


//Update updateTasksList() function
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    let filtered = tasks.filter(task =>
        currentFilter === "all" ? true :
        currentFilter === "completed" ? task.completed :
        !task.completed
    );

    // Sort by pin and then by date
    filtered.sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned - a.pinned;
        if (currentSort === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    //listItem.querySelector(".checkbox").addEventListener('change', () => toggleTaskComplete(index));


    filtered.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="https://cdn-icons-png.flaticon.com/512/2331/2331937.png" onclick="togglePin(${index})" title="Pin Task" width="20" height="20" />
                    <img src="https://cdn-icons-png.flaticon.com/512/1827/1827933.png" onclick="editTask(${index})" title="Edit Task" width="20" height="20" />
                    <img src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png" onclick="deleteTask(${index})" title="Delete Task" width="20" height="20" />
                </div>
            </div>
        `;

        listItem.addEventListener('change', () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};


document.getElementById("newTask").addEventListener("click",function(e){
    e.preventDefault();

    addTask();
});

const blastConfetti = ()=> {
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
    spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
    
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeToggle');
    icon.textContent = document.body.classList.contains('light-mode') ? "☀️" : "🌙";
}
    
}
