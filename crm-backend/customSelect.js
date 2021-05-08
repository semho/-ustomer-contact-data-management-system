'use strict';

import {createElement} from "./createElements.js";

//создание имитации селекта
export function createSelect(typeContacts) {
  const container = createElement('div', 'add-contact__dropdown, dropdown');
  const list = createElement('ul', 'add-contact__box-option, dropdown-menu');

  for (let i = 0; i <= typeContacts.length-1; i++) {
    const li = createElement('li', 'add-contact__option, dropdown-item', typeContacts[i].label);
    li.setAttribute('data-value', typeContacts[i].value);
    list.append(li);
  }
  //выбранный элемент по умолчанию
  const select = createElement('a', 'add-contact__select, btn', typeContacts[0].label);
  select.setAttribute('data-value', typeContacts[0].value);

  container.append(select, list);
  //обработчик на селект
  select.addEventListener('click', openListContacts);

  return container;
}

//функция открывает весь список контактов в селекте
function openListContacts() {
  //делаем видимым список
  this.nextElementSibling.classList.toggle('d-block');
  //добавляем клас самому селекту, чтобы перевернуть стрелку
  this.classList.toggle('is-active-select');
  //получаем все елементы списка
  const option = this.nextElementSibling.querySelectorAll('.add-contact__option');
  //вешаем на них обработчик
  option.forEach(element => {
    //в начале перебора скрытый элемент списка делаем видимым
    element.classList.remove('d-none');
    //если название элемента в списке равно текущему выбранному в селект, то делаем его невидимым
    if (element.textContent === this.textContent) {
      element.classList.add('d-none');
    }
  });
  //делегируем события каждого элемента списка на весь список
  this.nextElementSibling.addEventListener('click', (event) => choiceTypeContact(event));
}


//функция получает тип контакта и закрывает весь список контактов
function choiceTypeContact(event) {
  //получаем выбранный элемент списка
  const element = event.target.closest('.add-contact__option');
  //если в event.target нет element, то вернет null или если element не принадлежит текущему списку, тоже null
  if (!element || (!element.contains(element))) return;

  element.parentElement.classList.remove('d-block');                                               //сворачиваем список
  element.parentElement.previousElementSibling.classList.remove('is-active-select');               //стрелка в исходное состояние
  element.parentElement.previousElementSibling.textContent = element.textContent;                  //название селекта теперь = элементу списка
  element.parentElement.previousElementSibling.dataset.value  = element.getAttribute('data-value');//так же и его значение
  element.parentElement.parentElement.nextElementSibling.children[0].value = '';                   //при смене типа контакта сбрасываем введенные значения в поле ввода
}
