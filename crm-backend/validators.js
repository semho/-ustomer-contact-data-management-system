'use strict';

import { createElement } from "./createElements.js";

//валидатор на Фамилию и Имя на длинну строки и допустимые символы
export function validateName(string, input, prefix) {
  //находим и удаляем прежнию ошибку
  const oldError = document.querySelector(`.modal__error-${prefix}`);
  if (oldError) {
    oldError.remove();
  }
  //запись новой ошибки
  const stringError = createElement('span', `modal__error, modal__error-${prefix}`);
  if (!string.match(/^[a-zа-яёA-ZА-Я0-9]{3,15}$/)) {
    stringError.textContent = `Некорректно заполнено поле ${input}!`;
  } else {
    return false;
  }

  return stringError;
}

//валидатор Отчества на допустимые символы
export function validateLastName(string) {
  const oldError = document.querySelector(".modal__error-lastName");
  if (oldError) {
    oldError.remove();
  }

  const stringError = createElement('span', "modal__error, modal__error-lastName");
  if (string.match(/[0-9~!@#$%^&*()_-]/)) {
    stringError.textContent = "Недопустимые символы в поле Отчество!";
  } else {
    return false;
  }

  return stringError;
}
