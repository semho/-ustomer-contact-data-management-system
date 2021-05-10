'use strict';

import {createAppTitle, createTableThead, createTableTbody, createElement} from "./createElements.js";
import {showContacts, eventNewModal} from "./handlerFunctions.js";
import {getListClients} from "./queryFunctions.js";


//массив для хранения объектов клиента, объект как пример пример
let arrObjData = [
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021", dateUpdate: "21.02.2021", contacts:
    [
      { type: 'phone',
        value: '+7 (985) 443-00-00'},
      { type: 'email',
        value: '@mail.ru'},
      { type: 'vk',
        value: 'vk.com'},
      { type: 'fb',
        value: 'fb.com'},
      { type: 'other',
        value: 'Twitter: test@yandex.ru'},
      { type: 'other',
        value: 'Twitter: test@yandex.ru'},
      { type: 'other',
        value: 'Twitter: test@yandex.ru'},
    ],
    edit: "Изменить", delete: "Удалить"
  }
];

async function createControlPanelApp(container, title) {

  //делаем запрос к серверу для получения списка клиентов
  const queryGetList = await getListClients(container);

  //добавляем наш список объектов к исходному списку
  arrObjData.push(...queryGetList);

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
  btnMore.forEach(btn => btn.addEventListener('click', showContacts));

  //обработчик событий на кнопку "добавить клиента"
  btnAddClient.addEventListener('click', () => eventNewModal(container, arrObjData, controlPanelHead));
};

window.createControlPanelApp = createControlPanelApp;
