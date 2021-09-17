//criando array para armazenar os dados que vão para o localstorage
const toDoListArray = JSON.parse(localStorage.getItem('tasks')) || [];

//pegando elementos da página para manipular o dom
const formToDo = document.querySelector('#to-do-form');
const alertMessage = document.querySelector('.alert');
const toDoListContent = document.querySelector('.to-do-list');

//const com tag p para mostrar mensagem de lista vazia
const listaVazia = '<p class="lista-vazia" >Lista vazia</p>';

//listener para 'escutar' o evento submit
formToDo.addEventListener('submit', (event) => {
  event.preventDefault();
  let tasks = {};

  tasks.taskTitle = document.querySelector('#new-task').value;
  tasks.taskPriority = formToDo.elements['priority'].value;
  tasks.taskPriorityId = 0;
  tasks.isComplete = false;

  if (tasks.taskTitle === '') {
    alertMessage.innerHTML =
      'Por favor, informe o nome da tarefa a ser adicionada.';
    alertMessage.style = 'display: block; color: red';
  } else {
    toDoListArray.push(tasks);
    //map para passar id para prioridade para usar o sort e organizar as listas por ordem de prioridade
    toDoListArray.map((task) => {
      if (task.taskPriority == 'Alta') {
        task.taskPriorityId = 1;
      } else if (task.taskPriority == 'Média') {
        task.taskPriorityId = 2;
      } else if (task.taskPriority == 'Baixa') {
        task.taskPriorityId = 3;
      } else {
        console.log('id error');
      }
    });
    //setando novas tarefas no localstorage
    localStorage.setItem('tasks', JSON.stringify(toDoListArray));
    showToDoList(true);
    alertMessage.innerHTML = 'Tarefa adicionada com sucesso.';
    alertMessage.style = 'display: block; color: green';
    setTimeout(() => {
      closeModal();
      formToDo.removeEventListener('click', showAddTasksModal);
    }, 1000);
  }
});

//function para mostrar o modal de criar tarefas
function showAddTasksModal() {
  formToDo.style = 'display: flex';
}

//function para fechar o modal de criar tarefas
function closeModal() {
  alertMessage.innerHTML = '';
  formToDo.style = 'display: none;';
  formToDo.reset();
  alertMessage.style = 'display: none';
}

//function para exibir a lista de tarefas adicionadas
function showToDoList(clearList = false) {
  if (clearList) {
    removeShowAddTasksModal();
  }

  if (toDoListArray.length > 0) {
    toDoListArray.sort(compare);
    toDoListArray.forEach((task, index) => {
      if (task.isComplete == true) {
        toDoListContent.innerHTML += `<div class="card"><input type="checkbox" id="taskchecked" name="task-checked" onclick="checkedTask(event)" ><p class="isComplete">${task.taskTitle}</p>
          <p>${task.taskPriority}</p> <button id="${index}" class="btn-delete-task" onclick="deleteTask(event)">
          <img class="icon-delete-btn" src="./img/trash-can-outline.svg" alt="delete icon">
        </button></div>`;
      } else {
        toDoListContent.innerHTML += `<div class="card"><input type="checkbox" id="taskchecked" name="task-checked" onclick="checkedTask(event)" ><p>${task.taskTitle}</p>
          <p>${task.taskPriority}</p> <button id="${index}" class="btn-delete-task" onclick="deleteTask(event)">
          <img class="icon-delete-btn" src="./img/trash-can-outline.svg" alt="delete icon">
        </button></div>`;
      }
    });
  } else {
    toDoListContent.innerHTML = listaVazia;
  }
}

//function para deletar tarefas
function deleteTask(event) {
  const target = targetParentNode(event);
  const contentTarget = target.childNodes[1].textContent;
  const toDoListFiltered = toDoListArray.filter(
    (task) => task.taskTitle !== contentTarget
  );
  localStorage.setItem('tasks', JSON.stringify(toDoListFiltered));
  showToDoList(true);
  location.reload();
}

//functions para pegar event target
function targetEvent(event) {
  const target = event.target;
  return target;
}

function targetParentNode(event) {
  const target = event.currentTarget.parentNode;
  return target;
}

//function para checar se uma tarefa foi ticada como concluída
function checkedTask(event) {
  const target = targetEvent(event);
  const targetAdd = target.parentNode.childNodes[1];
  const contentTarget = targetAdd.textContent;

  if (target.checked) {
    toDoListArray.forEach((task) => {
      if (task.taskTitle === contentTarget) {
        task.isComplete = true;
        console.log(toDoListArray);
        localStorage.setItem('tasks', JSON.stringify(toDoListArray));
        location.reload();
      }
    });
  }
}

function removeShowAddTasksModal() {
  toDoListContent.innerHTML = '';
}

//function para mostrar lista de tarefas já concluídas
function showAddTasksModalDone() {
  removeShowAddTasksModal();
  toDoListArray.filter((task) => {
    if (task.isComplete == true) {
      toDoListContent.innerHTML += `<div class="card"><p class="isComplete">${task.taskTitle}</p>
          <p>${task.taskPriority}</p> <button class="btn-delete-task" onclick="deleteTask(event)">
          <img class="icon-delete-btn" src="./img/trash-can-outline.svg" alt="delete icon">
        </button></div>`;
    }
  });
}

//function para mostrar tarefas ainda a serem feitas
function showAddTasksModalNotDone() {
  removeShowAddTasksModal();
  toDoListArray.filter((task) => {
    if (task.isComplete !== true) {
      toDoListContent.innerHTML += `<div class="card"><input type="checkbox" id="taskchecked" name="task-checked" onclick="checkedTask(event)" ><p>${task.taskTitle}</p>
          <p>${task.taskPriority}</p> <button  class="btn-delete-task" onclick="deleteTask(event)">
          <img class="icon-delete-btn" src="./img/trash-can-outline.svg" alt="delete icon">
        </button></div>`;
    }
  });
}

//function de comparação para usar com o sort() para organizar as tarefas por prioridade
function compare(a, b) {
  return a.taskPriorityId - b.taskPriorityId;
}

window.onload = () => {
  showToDoList();
};
