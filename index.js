const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let tasks = loadTasks();
let currentEditTaskId = null;

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks(tasks);
    updateUI(tasks);

    taskInput.value = '';
});

taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
        const taskId = parseInt(e.target.dataset.id);
        currentEditTaskId = taskId;
        $('#deleteTaskModal').modal('show');
    } else if (e.target.classList.contains('edit')) {
        const taskId = parseInt(e.target.dataset.id);
        currentEditTaskId = taskId;
        const task = tasks.find(task => task.id === taskId);
        const modalEditTaskInput = document.getElementById('modalEditTaskInput');
        modalEditTaskInput.value = task.text;
        $('#editTaskModal').modal('show');
    } else if (e.target.classList.contains('complete')) {
        const taskId = parseInt(e.target.dataset.id);
        const task = tasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        saveTasks(tasks);
        updateUI(tasks);
    }
});

document.getElementById('modalAddTask').addEventListener('click', function() {
    const modalTaskInput = document.getElementById('modalTaskInput');
    const taskText = modalTaskInput.value.trim();

    if (taskText !== '') {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(task);
        saveTasks(tasks);
        updateUI(tasks);

        modalTaskInput.value = '';
        $('#addTaskModal').modal('hide');
    }
});

document.getElementById('modalConfirmDelete').addEventListener('click', function() {
    tasks = tasks.filter(task => task.id !== currentEditTaskId);
    saveTasks(tasks);
    updateUI(tasks);

    currentEditTaskId = null;
    $('#deleteTaskModal').modal('hide');
});

document.getElementById('modalSaveEdit').addEventListener('click', function() {
    const modalEditTaskInput = document.getElementById('modalEditTaskInput');
    const updatedTaskText = modalEditTaskInput.value.trim();

    if (updatedTaskText !== '') {
        const task = tasks.find(task => task.id === currentEditTaskId);
        task.text = updatedTaskText;
        saveTasks(tasks);
        updateUI(tasks);
    }

    currentEditTaskId = null;
    $('#editTaskModal').modal('hide');
});

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateUI(tasks) {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex align-items-center';
        listItem.innerHTML = `
            <span class="flex-grow-1 ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="btn btn-success btn-sm complete mr-2" data-id="${task.id}">Complete</button>
            <button class="btn btn-primary btn-sm edit mr-2" data-id="${task.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete" data-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(listItem);
    });
}

updateUI(tasks);
