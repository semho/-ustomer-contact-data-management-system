'use strict';

import {createModal, createGroupSelect} from "./createElements.js";
import {createSelect} from "./customSelect.js";
import {validateName, validateLastName} from "./validators.js";

//показываем скрытые контакты
export function showContacts() {
  event.preventDefault();
  this.parentElement.querySelectorAll('.d-none').forEach(li => {
    li.classList.remove('d-none');
  })
  this.remove();
}
//функция на событие нажатия кнопки "добавить клиент"
export function eventNewModal(container) {
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
  modal.btnSave.addEventListener('click', (event) => saveContact(modal, event));
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
function saveContact(modal, event) {
  event.preventDefault();
  //собираем поля формы модального окна
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
  //если ошибок нет, отправляем на сервер
  if (!resultErrorValidateName && !resultErrorValidateSecondName && !resultErrorValidateLastName) {
    console.log('ok');
  }
}
