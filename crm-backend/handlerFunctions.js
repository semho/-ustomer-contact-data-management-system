'use strict';

import {createModal, createGroupSelect} from "./createElements.js";
import {createSelect} from "./customSelect.js";

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
}
//функция на изменение полей ввода фио клиента
function changeValueInput() {
  if (this.value !== '') {
    this.parentElement.querySelector('.modal__placeholder').classList.add('is-active');
  } else {
    this.parentElement.querySelector('.modal__placeholder').classList.remove('is-active');
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
