'use strict';

import {createModal, createGroupSelect, createTableTbody, createModalDelete, createElement} from "./createElements.js";
import {createSelect} from "./customSelect.js";
import {validateName, validateLastName, validateErrorsServer, validateDataTypeContact} from "./validators.js";
import {getListClients, createClient, deleteClient, getClient, editClient} from "./queryFunctions.js";
import {showSearch} from "./filters.js";

let requestId;

//сохраняем адресную строку в буфер
export function saveLinkHash() {
  navigator.clipboard.writeText(location.href)
  .then(() => {
    // Получилось!
  })
  .catch(err => {
    console.log('Something went wrong', err);
  });
}


//обработчик хэша
export function hashchange(container, arrObjData, controlPanelHead) {
  const hash = decodeURI(location.hash).substr(1);
  //const parse = JSON.parse(hash);
  //создаем модальное окно
  eventNewModal(container, arrObjData, controlPanelHead, hash);

  //и сразу записываем ссылку в буфер обмена
  saveLinkHash();
}

//обработка поискового запроса
export async function onChange(e) {
  const queryGetList = await getListClients(e.target.value);
  const table = document.querySelector('.table ');
  //поисковой запрос без query параметра
  //showSearch(e.target.value, table, queryGetList);
  updateTable(table, queryGetList);
}

//функция обертка debounce для непрерывного ввода
export const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => {fn.apply(this, arguments)}
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  }
}

//показываем скрытые контакты
function showContacts(btnMore) {
  btnMore.parentElement.querySelectorAll('.d-none').forEach(li => {
    li.classList.remove('d-none');
  })
  btnMore.remove();
}
//функция на событие нажатия кнопки "добавить клиент"/изменить
export function eventNewModal(container, arrObjData, headerTable, id) {
  //Если модальное окно уже есть, удалим его
  if (document.querySelector('.control-panel__modal')) {
    document.querySelector('.control-panel__modal').remove();
    // clearTimeout(idTimer);
    cancelAnimationFrame(requestId);
  }
  //создаем модальное окно
  const modal = createModal(id);
  container.append(modal.wrapper);
  

  //анимация модального окна
  requestId = animate({
    duration: 300,
    timing(timeFraction) {
      return timeFraction;
    },
    draw(progress) {
      const modal = document.querySelector('.modal__content');
      modal.style.opacity = progress;
      modal.style.transform = 'scale(' + progress + ')';
    }
  });

  //обработчики событий закрытия модального окна
  if (!id) {
    modal.cansel.addEventListener('click', () => modal.wrapper.remove());
  } else {
    modal.btnDelete.addEventListener('click', () => modalDelete(container, arrObjData, id));
  }
  modal.close.addEventListener('click', () => modal.wrapper.remove());
  //обработчик событий измений в поле ввода модального окна
  const inputModal = document.querySelectorAll('.modal__content input');
  inputModal.forEach(input => input.addEventListener('input', changeValueInput));
  //массив объектов для селекта
  const typeContacts = [
    {value: 'phone', label: 'Телефон'},
    {value: 'other', label: 'Другое'},
    {value: 'email', label: 'Email'},
    {value: 'vk', label: 'Vk'},
    {value: 'fb', label: 'Facebook'},
  ];
  //если есть id, значит клиент есть в базе, получаем его из бд и заполняем поля формы
  if (id) {
    fillingForm(typeContacts, modal, id);
  }
  //обработчик событий на добавление нового типа контакта в модальном окне
  modal.btnAddContact.addEventListener('click', () => createNewTypeContact(typeContacts, modal.btnAddContact));
  //вешаем обработчик на кнопку сохранения  клиента
  modal.btnSave.addEventListener('click', (event) => saveClient(modal, arrObjData, headerTable, id, event));
}

//функция на изменение полей ввода фио клиента
function changeValueInput() {
  if (this.value !== '') {
    //если есть текст, добавляем класс к нашему плейсхолдеру для его стилизации
    this.parentElement.querySelector('.modal__placeholder').classList.add('is-active');
    //если есть хотя бы один из перечисленных символов, ипнут подсветится как ошибка
    if (this.value.trim().match(/[0-9~!@#$%^&*()_-]/)) {
      this.classList.add('error-border');
    } else {
      this.classList.remove('error-border');
    }
  } else {
    //если текста нет, то удаляем класс у плейсходера и ошибки
    this.parentElement.querySelector('.modal__placeholder').classList.remove('is-active');
    this.classList.remove('error-border');
  }
}
//создаем новый тип контакта в модальном окне
function createNewTypeContact(typeContacts, btnAddContact, value, type) {
  //создаем селект
  const selectTypeContact = createSelect(typeContacts, type);
  //отправляем в представление для создания группы объединения селекта с инпут
  const selectGroup = createGroupSelect(selectTypeContact, value);
  //добавляем в DOM
  btnAddContact.before(selectGroup.wrapper);
  //обработчик на поле ввода
  selectGroup.input.addEventListener('input', () => changeInputTypeContact(selectGroup));
  //обработчик на кнопку удаления типа контакта
  selectGroup.btn.addEventListener('click', () => selectGroup.wrapper.remove());
  //убираем кнопку "добавить контакт", если контактов больше 10
  const count = document.querySelectorAll('.add-contact__box');
  if (count.length >= 10) {
    btnAddContact.remove();
  }
}

//проверяем поле на заполнение
function changeInputTypeContact(selectGroup) {
  if (selectGroup.input.value !== '') {
    selectGroup.btn.classList.remove('d-none');
    selectGroup.input.classList.remove('error-border');
  } else {
    selectGroup.btn.classList.add('d-none');
    selectGroup.input.classList.add('error-border');
  }
}

//функция сохранения клиента
async function saveClient(modal, arrObjData, headerTable, id, event) {
  event.preventDefault();
  //собираем поля ФИО формы модального окна
  const secondName = modal.wrapper.querySelector('[name = secondName]');
  const firstName = modal.wrapper.querySelector('[name = name]');
  const lastName = modal.wrapper.querySelector('[name = lastName]');
  //валидация полей формы ФИО
  const resultErrorValidateName = validateName(firstName, "Имя", "name");
  const resultErrorValidateSecondName = validateName(secondName, "Фамилия", "secondName");
  const resultErrorValidateLastName = validateLastName(lastName);
  //если ошибки есть, выводим их
  if (resultErrorValidateName) {
    modal.btnSave.before(resultErrorValidateName);
  }
  if (resultErrorValidateSecondName) {
    modal.btnSave.before(resultErrorValidateSecondName);
  }
  if (resultErrorValidateLastName) {
    modal.btnSave.before(resultErrorValidateLastName);
  }

  //получаем данные полей типа контакта
  const dataType = modal.wrapper.querySelectorAll('[name = data-contact]');
  //проверяем их на заполнение
  const resultErrorValidateDataType = validateDataTypeContact(dataType);
  //если ошибки есть, выводим их
  if (resultErrorValidateDataType) {
    modal.btnSave.before(resultErrorValidateDataType);
  }
  
  //если ошибок нет
  if (!resultErrorValidateName && !resultErrorValidateSecondName && !resultErrorValidateLastName && !resultErrorValidateDataType) {

    //заглушка, пока ждем ответ сервера
    headerTable.classList.add('loading');
    //const widthTable = headerTable.tBodies[0].offsetWidth;
    const heightTable = headerTable.tBodies[0].offsetHeight;
    document.querySelector('.control-panel__spiner').style.height = heightTable + 'px';
    //document.querySelector('.control-panel__spiner').style.width = widthTable + 'px';

    //массив для сохранения объектов типа контактов
    const arrTypeContacts = [];
    //выбираем наш контейнер селекта
    const selectBox = document.querySelectorAll('.add-contact__box');
    //переберием каждый контейнер селекта и записываем объекта с данными в массив
    selectBox.forEach(element => {
      const input = element.querySelector('.add-contact__input');
      const selected = element.querySelector('.add-contact__select');
      if (input.value !== '') {
        arrTypeContacts.push({
          type: selected.dataset.value,
          value: input.value
        });
      }
    });

    //собираем данные клиента в объект
    const client = {
      name: firstName.value,
      surname: secondName.value,
      lastName: lastName.value,
      contacts: arrTypeContacts
    };

    let resultQuery = '';

    if (!id) {
      //запрос на добавление нового клиента в бд
      resultQuery = await createClient(client);
    } else {
      //найдем в массиве хранения объектов наш изменяемый объект клиента
      const currentClient = arrObjData.find(item => item.id == id);
      //удалим из массива
      arrObjData.splice(arrObjData.indexOf(currentClient), 1);
      //запрос на изменение объекта клиента
      resultQuery = await editClient(client, id);
    }
    //если запросы возвращаю объект, а не строку с ошибкой:
    if (typeof resultQuery === 'object' && resultQuery !== null) {
      //добавляем сохраненный объект в исходный массив хранения списка объектов для меньшей нагрузки на сервер во время последующей перерисовки таблицы
      arrObjData.push(...resultQuery);

      //обновляем таблицу
      updateTable(headerTable, arrObjData);
      //очищаем форму
      //document.formClients.reset();

      //удаляем модальное окно
      modal.wrapper.remove();
      //удаляем заглушку предзагрузки
      headerTable.classList.remove('loading');
    } else {
      const error = validateErrorsServer(resultQuery);
      modal.btnSave.before(error);
    }
  }
}

export function updateTable(headerTable, arrObjData) {
  //удаляем прежнее тело таблицы
  headerTable.tBodies[0].remove();
  //и вновь создаем
  createTableTbody(headerTable, arrObjData);
}

//обработка массива объектов полученного от сервера для представления в приложение
export function getProcessedListObj(result) {
  const arrObj = [];
  if (Array.isArray(result)) {
    result.forEach(obj => {
      const newDate = getFormatDate(obj.createdAt);
      const upDate = getFormatDate(obj.updatedAt);
      arrObj.push({
        id: obj.id,
        name: obj.surname + ' ' + obj.name + ' ' + obj.lastName,
        dateNew: newDate,
        dateUpdate: upDate,
        contacts: obj.contacts,
        editAndDelete: "Изменить Удалить",
        link: "Получить"
      })
    });
  } else {
    const newDate = getFormatDate(result.createdAt);
    const upDate = getFormatDate(result.updatedAt);
    arrObj.push({
      id: result.id,
      name: result.surname + ' ' + result.name + ' ' + result.lastName,
      dateNew: newDate,
      dateUpdate: upDate,
      contacts: result.contacts,
      editAndDelete: "Изменить Удалить",
      link: "Получить"
    })
  }

  return arrObj;
}
// модификация даты
function getFormatDate(date) {
  const dateDMY = date.split('T')[0].split('-');
  const dateHM = date.split('T')[1].split(':');

  return `${dateDMY[2]}.${dateDMY[1]}.${dateDMY[0]} ${dateHM[0]}:${dateHM[1]}`;
}

//функция обработчика событий на таблице
export function eventOnTable(container, arrObjData, headerTable, event) {

  //получаем id удаляемого объекта
  const idDelete = getIdByTarget('.table__body-delete', event);

  if (idDelete) {
    modalDelete(container, arrObjData, idDelete.textContent)
  }

  //получаем id изменяемого объекта
  const idEdit = getIdByTarget('.table__body-edit', event);

  if (idEdit) {
    eventNewModal(container, arrObjData, headerTable, idEdit.textContent);
  }

  //иконка скрытых контактов клиента
  const btnMore = getTarget('.list-contact__more', event);
  //показываем контакты
  if (btnMore) {
    showContacts(btnMore);
  }

  //получаем ссылку на кнопку
  const link = getTarget('.table__body-textlink', event);
  if (link !== undefined) {
    changeHash(link);
  }
}
//функция записи в хэш
function changeHash(link) {
  //id
  const id = link.parentNode.parentNode.querySelector('.table__body-id').textContent;
  window.location.hash = id;
}
//получение id по событию клика на кнопку
function getIdByTarget(classTarget, event) {

  //отслеживаем кнопку
  const btn = event.target.closest(classTarget);

  //если в event.target нет btn, то вернет null или если btn не принадлежит текущему контакту, тоже null
  if (!btn || (!btn.contains(btn))) return;

  //получаем родителя
  const tr = btn.parentElement.parentElement;

  // //получаем id
  const id = tr.children[0];

  // //возвращаем id
  return id
}

function getTarget(classTarget, event) {
  //отслеживаем кнопку
  const btn = event.target.closest(classTarget);

  //если в event.target нет btn, то вернет null или если btn не принадлежит текущему контакту, тоже null
  if (!btn || (!btn.contains(btn))) return;

  return btn
}

//функция берет данные объекта клиента из БД и заполняет форму модального окна
async function fillingForm(typeContacts, modal, id) {
  const client = await getClient(id);
  //если сервер вернул объект
  if (typeof client === 'object' && client !== null) {
    //заполняем форму ФИО
    fillingFullName(modal, client);
    //если массив "контакты" содержит объекты
    if (client.contacts.filter(i => i.constructor.name === "Object").length > 0) {
      //перебираем их
      client.contacts.forEach(obj => {
        //и добавляем в группу селект-инпут
        createNewTypeContact(typeContacts, modal.btnAddContact, obj.value, obj.type);
      });
    }
  } else {
    const error = validateErrorsServer(client);
    modal.btnSave.before(error);
  }
}
//функция заполняет поля формы ФИО
function fillingFullName(modal, client) {
  //получаем поля формы ФИО
  const secondName = modal.wrapper.querySelector('[name = secondName]');
  const firstName = modal.wrapper.querySelector('[name = name]');
  const lastName = modal.wrapper.querySelector('[name = lastName]');
  //поставляем значения из объекта БД
  secondName.value = client.surname;
  firstName.value = client.name;
  lastName.value = client.lastName;
  //добаляем класс к плейсхолдер
  secondName.nextElementSibling.classList.add("is-active");
  firstName.nextElementSibling.classList.add("is-active");
  if (client.lastName) {
    lastName.nextElementSibling.classList.add("is-active");
  }
}
//создание модального окна удаления клиента
function modalDelete(container, arrObjData, idDelete) {
  //Если модальное окно уже есть, удалим его
  if (document.querySelector('.control-panel__modal')) {
    document.querySelector('.control-panel__modal').remove();
  }
  //создаем модальное окно
  const modal = createModalDelete();
  container.append(modal.wrapper);

  //анимация модального окна
  requestId = animate({
    duration: 300,
    timing(timeFraction) {
      return timeFraction;
    },
    draw(progress) {
      const modal = document.querySelector('.modal__content');
      modal.style.opacity = progress;
      modal.style.transform = 'scale(' + progress + ')';
    }
  });

  //обработчики закрытия модального окна
  modal.close.addEventListener('click', () => modal.wrapper.remove());
  modal.cansel.addEventListener('click', () => modal.wrapper.remove());
  //вешаем обработчик на кнопку удаления контакта из таблицы и БД
  modal.btnDelete.addEventListener('click', () => eventDeleteClient(modal, arrObjData, idDelete));
}
//функция обработки события удаления клиента
async function eventDeleteClient(modal, arrObjData, idDelete) {
  //удаляем клиента из бд
  const result = await deleteClient(idDelete);

  //если в статусе ответа сервера на удаления клиента не число
  if (typeof result !== "number") {

    //найдем в массиве хранения объектов наш удаляемый объект клиента
    const currentClient = arrObjData.find(item => item.id == idDelete);
    //удалим из массива
    arrObjData.splice(arrObjData.indexOf(currentClient), 1);

    //и таблицы
    const cellsId = document.querySelectorAll('.table__body-id');
    cellsId.forEach(id => {
      if (id.textContent === idDelete) {
        id.parentElement.remove();
      }
    });
    //idDelete.parentElement.remove();
    //удаляем модальное окно после события
    modal.wrapper.remove();
  } else {
    const error = validateErrorsServer(result);
    modal.btnDelete.before(error);
  }
}

//анимация
function animate({duration, draw, timing}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction)

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}