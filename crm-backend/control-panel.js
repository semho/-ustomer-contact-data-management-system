'use strict';

const arrObjData = [
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts: [{phone: "+7 (985) 443-00-00"}, {email: "@mail.ru"}, {vk: "vk.com"}, {fb: "fb.com"}, {other: "Twitter: test@yandex.ru"}, {other: "Twitter: test@yandex.ru"}, {other: "Twitter: test@yandex.ru"}], edit: "Изменить", delete: "Удалить"},
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts: [{phone: "+7 (985) 443-00-00"}, {email: "@mail.ru"}, {vk: "vk.com"}, {other: "Twitter: test@yandex.ru"}, {other: "Twitter: test@yandex.ru"}], edit: "Изменить", delete: "Удалить"},
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts: [{phone: "+7 (985) 443-00-00"}, {email: "@mail.ru"}, {vk: "vk.com"}], edit: "Изменить", delete: "Удалить"},
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts: [{phone: "+7 (985) 443-00-00"}, {email: "@mail.ru"}, {vk: "vk.com"}], edit: "Изменить", delete: "Удалить"},
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts: [{phone: "+7 (985) 443-00-00"}, {email: "@mail.ru"}, {vk: "vk.com"}], edit: "Изменить", delete: "Удалить"}
];


import {createAppTitle, createTableThead, createTableTbody, createElement} from "./createElements.js";
import {showContacts} from "./handlerFunctions.js";

function createControlPanelApp(container, title) {
  //заголовок приложения
  const controlPanelTitle = createAppTitle(title);
  container.append(controlPanelTitle);
  //заголовки колонок таблицы
  const titleTable = {id: "ID", name: "Фамилия Имя Отчество", dateNew: "Дата и время создания", dateUpdate: "Последние изменения", contacts: "Контакты", action: "Действия"};
  const controlPanelHead = createTableThead(titleTable);
  container.append(controlPanelHead);
  //тело таблицы
  const controlPanelBody = createTableTbody(controlPanelHead, arrObjData);
  container.append(controlPanelBody);
  //кнопка добавления клиента
  const btnAddClient = createElement("button", "control-panel__button, btn", "Добавить клиента");
  container.append(btnAddClient);
  //вешаем обработчики событий на иконку скрытых контактов
  const btnMore = document.querySelectorAll('.list-contact__more');
  btnMore.forEach(btn => {
    btn.addEventListener('click', showContacts);
  });
};


window.createControlPanelApp = createControlPanelApp;
