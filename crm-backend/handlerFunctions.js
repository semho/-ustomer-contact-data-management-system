'use strict';

import {createModal, createGroupSelect, createTableTbody} from "./createElements.js";
import {createSelect} from "./customSelect.js";
import {validateName, validateLastName} from "./validators.js";
import {createClient} from "./queryFunctions.js";

//показываем скрытые контакты
export function showContacts() {
  event.preventDefault();
  this.parentElement.querySelectorAll('.d-none').forEach(li => {
    li.classList.remove('d-none');
  })
  this.remove();
}
//функция на событие нажатия кнопки "добавить клиент"
export function eventNewModal(container, arrObjData, headerTable) {
  //Если модальное окно уже есть, удалим его
  if (document.querySelector('.control-panel__modal')) {
    document.querySelector('.control-panel__modal').remove();
  }
  //создаем модальное окно
  const modal = createModal();
  container.append(modal.wrapper);
  //обработчики событий закрытия модального окна
  modal.close.addEventListener('click', () => modal.wrapper.remove());
  modal.cansel.addEventListener('click', () => modal.wrapper.remove());
  //обработчик событий измений в поле ввода модального окна
  const inputModal = document.querySelectorAll('.modal__content input');
  inputModal.forEach(input => input.addEventListener('input', changeValueInput));
  //массив объектов для селекта
  const typeContacts = [
    {value: 'phone', label: 'Телефон'},
    {value: 'other', label: 'Доп.телефон'},
    {value: 'email', label: 'Email'},
    {value: 'vk', label: 'Vk'},
    {value: 'fb', label: 'Facebook'},
  ];
  //обработчик событий на добавление нового типа контакта в модальном окне
  modal.btnAddContact.addEventListener('click', () => createNewTypeContact(typeContacts, modal.btnAddContact));

  //вешаем обработчик на кнопку сохранения контакта
  modal.btnSave.addEventListener('click', (event) => saveContact(modal, arrObjData, headerTable, event));
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
function createNewTypeContact(typeContacts, btnAddContact) {
  //создаем селект
  const selectTypeContact = createSelect(typeContacts);
  //отправляем в представление для создания группы объединения селекта с инпут
  const selectGroup = createGroupSelect(selectTypeContact);
  //добавляем в DOM
  btnAddContact.before(selectGroup.wrapper);
  //обработчик на поле ввода
  selectGroup.input.addEventListener('input', () => changeInputTypeContact(selectGroup));
  //обработчик на кнопку удаления типа контакта
  selectGroup.btn.addEventListener('click', () => selectGroup.wrapper.remove());
}

//проверяем поле на заполнение
function changeInputTypeContact(selectGroup) {
  if (selectGroup.input.value !== '') {
    selectGroup.btn.classList.remove('d-none');
  } else {
    selectGroup.btn.classList.add('d-none');
  }
}

//функция сохранения контакта
async function saveContact(modal, arrObjData, headerTable, event) {
  event.preventDefault();
  //собираем поля ФИО формы модального окна
  const secondName = modal.wrapper.querySelector('[name = secondName]').value.trim();
  const firstName = modal.wrapper.querySelector('[name = name]').value.trim();
  const lastName = modal.wrapper.querySelector('[name = lastName]').value.trim();
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
  //если ошибок нет
  if (!resultErrorValidateName && !resultErrorValidateSecondName && !resultErrorValidateLastName) {
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
      name: firstName,
      surname: secondName,
      lastName: lastName,
      contacts: arrTypeContacts
    };
    //запрос на добавление нового клиента в бд
    const queryCreateClient = await createClient(client);
    //добавляем сохраненный объект в исходный массив хранения списка объектов для меньшей нагрузки на сервер во время последующей перерисовки таблицы
    arrObjData.push(...queryCreateClient);

    //обновляем таблицу
    updateTable(headerTable, arrObjData);
    //очищаем форму
    //document.formClients.reset();

    //удаляем модальное окно
    modal.wrapper.remove();
  }
}

function updateTable(headerTable, arrObjData) {
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
        edit: "Изменить",
        delete: "Удалить"
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
      edit: "Изменить",
      delete: "Удалить"
    })
  }

  return arrObj;
}
// модификация даты
function getFormatDate(date) {
  const oldDate = date.split('T')[0].split('-');
  return `${oldDate[2]}.${oldDate[1]}.${oldDate[0]}`
}
