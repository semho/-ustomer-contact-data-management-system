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
  if (!string.match(/^[a-zа-яёA-ZА-Я0-9]{3,20}$/)) {
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
//обробатываем статусы ответа сервера
export function validateErrorsServer(numberError) {

  let error; //переменная для записи строки ошибок
  let numberErrorServer = Boolean(~String(numberError).indexOf(String(5))); //проверяем на совпадения с ошибкой 5хх

  if (numberErrorServer) {
    numberErrorServer = 500;
  } else {
    numberErrorServer = numberError;
  }

  switch(numberErrorServer) {
    case 404:
      error = 'Клиент не найден на сервере';
      break;
    case 422:
      error = 'Серверу не удалось обработать инструкции содержимого';
      break;
    case 500:
      error = 'Внутренняя ошибка сервера';
      break;
    default:
      error = 'Что-то пошло не так...';
      break;
  }

  const stringError = createElement('span', "modal__error", String(error));

  return stringError;
}
