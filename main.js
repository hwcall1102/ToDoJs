import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListEl = document.getElementById('taskList');

let tasks = [];

// Load tasks from localStorage if available
const loadTasks = () => {
  const stored = localStorage.getItem('todo_tasks');
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch (e) {
      console.error('Invalid localStorage data');
    }
  }
};

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
};

// Recursively render tasks
const renderTasks = (tasksArray, parentElement) => {
  parentElement.innerHTML = '';

  const render = (index) => {
    if (index >= tasksArray.length) return;

    const task = tasksArray[index];
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
      ${task.text}
      <button data-id="${task.id}" class="delete-btn">🗑️</button>
    `;

    parentElement.appendChild(li);
    render(index + 1);
  };

  render(0);
};

const addTask = () => {
  const text = taskInput.value.trim();
  if (!text) {
    alert('Please enter a task.');
    return;
  }

  tasks.push({
    id: uuidv4(),
    text,
    completed: false
  });

  taskInput.value = '';
  saveTasks();
  renderTasks(tasks, taskListEl);
};

const handleListClick = (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.matches('input[type="checkbox"]')) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }

  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id !== id);
  }

  saveTasks();
  renderTasks(tasks, taskListEl);
};

addTaskBtn.addEventListener('click', addTask);
taskListEl.addEventListener('click', handleListClick);

// Load and render tasks at startup
loadTasks();
renderTasks(tasks, taskListEl);
