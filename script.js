const toDoListArray = JSON.parse(localStorage.getItem('tasks')) || [];

const formToDo = document.querySelector('#to-do-form');
const alertMessage = document.querySelector('.alert');

formToDo.addEventListener('submit', (event) => {
  event.preventDefault();
  let tasks = {};

  tasks.taskTitle = document.querySelector('#new-task').value;
  tasks.taskPriority = formToDo.elements['priority'].value;

  if (tasks.taskTitle === '') {
    alertMessage.innerHTML =
      'Por favor, informe o nome da tarefa a ser adicionada.';
    alertMessage.style = 'display: block; color: red';
  } else {
    toDoListArray.push(tasks);
    localStorage.setItem('tasks', JSON.stringify(toDoListArray));
    showToDoList(true);
    alertMessage.innerHTML = 'Tarefa adicionada com sucesso.';
    alertMessage.style = 'display: block; color: green';
    setTimeout(() => {
      closeModal();
      formToDo.removeEventListener('click', showAddTasksModal);
    }, 2000);
  }
});

function showAddTasksModal() {
  formToDo.style = 'display: flex';
}

function closeModal() {
  alertMessage.innerHTML = '';
  formToDo.style = 'display: none;';
  formToDo.reset();
  alertMessage.style = 'display: none';
}

function showToDoList(clearList = false) {
  const toDoListContent = document.querySelector('.to-do-list');
  if (clearList) {
    toDoListContent.innerHTML = '';
  }

  if (toDoListArray.length > 0) {
    toDoListArray.forEach((task, index) => {
      toDoListContent.innerHTML += `<div class="card"><input type="checkbox" id="taskchecked" name="task-checked" onclick="checkedTask(event)" ><p>${task.taskTitle}</p>
          <p>${task.taskPriority}</p> <button id="${index}" class="btn-delete-task" onclick="deleteTask(event)">
          <img class="icon-delete-btn" src="./img/trash-can-outline.svg" alt="delete icon">
        </button></div>`;
    });
  } else {
    toDoListContent.innerHTML = 'Lista vazia.';
  }
}

function deleteTask(event) {
  const target = event.currentTarget.parentNode;
  const contentTarget = target.childNodes[1].textContent;
  const toDoListFiltered = toDoListArray.filter(
    (task) => task.taskTitle !== contentTarget
  );
  localStorage.setItem('tasks', JSON.stringify(toDoListFiltered));
  showToDoList(true);
  location.reload();
}

function checkedTask(event) {
  const target = event.target;
  const targetAdd = target.parentNode.childNodes[1];

  if (target.checked) {
    targetAdd.style = 'text-decoration: line-through';
  }
}

window.onload = () => {
  showToDoList();
};
