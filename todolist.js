const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

addTaskButton.addEventListener('click', addTask);
document.getElementById('clearAllButton').addEventListener('click', clearAllTasks);

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk mengambil tugas dari localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Ambil tugas dari localStorage saat halaman dimuat
let tasks = getTasks();

// Tampilkan tugas saat halaman dimuat
displayTasks(tasks);

// Modifikasi fungsi addTask untuk menyimpan tugas baru
function addTask() {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;

    if (taskText) {
        tasks.push({
            id: Date.now().toString(), // Tambahkan ID unik
            text: taskText,
            category: category,
            checked: false
        });

        saveTasks(tasks); // Simpan tugas ke localStorage
        displayTasks(tasks);
        taskInput.value = '';
    }
}

// Modifikasi fungsi toggleTask untuk menyimpan perubahan status tugas
function toggleTaskStatus(event) {
    const taskId = event.target.dataset.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].checked = event.target.checked;
        saveTasks(tasks); // Simpan perubahan ke localStorage
        displayTasks(tasks);
    }
}

// Modifikasi fungsi deleteTask untuk menyimpan perubahan setelah menghapus tugas
function deleteTask(event) {
    const taskId = event.target.dataset.id;
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks); // Simpan perubahan ke localStorage
    displayTasks(tasks);
}

// Modifikasi fungsi clearAllTasks untuk menyimpan perubahan setelah menghapus semua tugas
function clearAllTasks() {
    if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
        tasks = []; // Kosongkan array tugas
        saveTasks(tasks); // Simpan perubahan ke localStorage
        displayTasks(tasks);
    }
}

// Modifikasi fungsi searchTasks untuk menggunakan array tugas yang diambil dari localStorage
function searchTasks() {
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
    displayTasks(filteredTasks);
}

// Fungsi untuk menampilkan tugas dari localStorage
function displayTasks(tasksToDisplay) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasksToDisplay.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.checked ? 'checked' : ''} data-id="${task.id}">
            <span>${task.text} (${task.category})</span>
            <button class="edit" data-id="${task.id}">Edit</button>
            <button class="delete" data-id="${task.id}">Hapus</button>
        `;
        taskList.appendChild(li);

        // Tambahkan event listener untuk checkbox dan tombol hapus
        li.querySelector('input[type="checkbox"]').addEventListener('change', toggleTaskStatus);
        li.querySelector('.delete').addEventListener('click', deleteTask);
        li.querySelector('.edit').addEventListener('click', () => editTask(task.id));
    });
}

function editTask(taskId) {
    const taskToEdit = tasks.find(task => task.id === taskId);

    if (taskToEdit) {
        const newTaskText = prompt('Edit tugas:', taskToEdit.text);
        const newTaskCategory = prompt('Edit kategori:', taskToEdit.category);

        if (newTaskText !== null && newTaskCategory !== null) {
            taskToEdit.text = newTaskText;
            taskToEdit.category = newTaskCategory;
            saveTasks(tasks);
            displayTasks(tasks);
        }
    }
}
function searchTasks() {
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'todolist.html?search=' + searchTerm;
    } else {
        const tasks = getTasks();
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
        displayTasks(filteredTasks, searchTerm);
    }
}

function displayTasks(tasksToDisplay, searchTerm = '') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasksToDisplay.forEach(task => {
        const li = document.createElement('li');
        let taskText = task.text;
        if (searchTerm && task.text.toLowerCase().includes(searchTerm)) {
            taskText = taskText.replace(new RegExp(searchTerm, 'gi'), match => `<span style="background-color: lightgray;">${match}</span>`);
            taskList.prepend(li); // Menempatkan hasil pencarian di atas
        }
        li.innerHTML = `
            <input type="checkbox" ${task.checked ? 'checked' : ''} data-id="${task.id}">
            <span>${taskText} (${task.category})</span>
            <button class="edit" data-id="${task.id}">Edit</button>
            <button class="delete" data-id="${task.id}">Hapus</button>
        `;
        if(!searchTerm){
            taskList.appendChild(li);
        }

        li.querySelector('input[type="checkbox"]').addEventListener('change', toggleTaskStatus);
        li.querySelector('.delete').addEventListener('click', deleteTask);
        li.querySelector('.edit').addEventListener('click', () => editTask(task.id));
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    if (searchTerm) {
        document.getElementById('searchTask').value = searchTerm;
        searchTasks();
    } else {
        displayTasks(getTasks());
    }
}