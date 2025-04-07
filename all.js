function displayAllTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const unfinishedTaskList = document.getElementById('unfinishedTaskList');
    const finishedTaskList = document.getElementById('finishedTaskList');
    unfinishedTaskList.innerHTML = '';
    finishedTaskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.checked ? 'checked' : ''} disabled>
            <span>${task.text} (${task.category})</span>
        `;
        if (task.checked) {
            finishedTaskList.appendChild(li);
        } else {
            unfinishedTaskList.appendChild(li);
        }
    });
}

displayAllTasks();