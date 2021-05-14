'use strict';

import {createAppTitle, createTableThead, createTableTbody, createElement} from "./createElements.js";
import {eventNewModal, eventOnTable} from "./handlerFunctions.js";
import {getListClients} from "./queryFunctions.js";
import {validateErrorsServer} from "./validators.js";


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
        value: 'test@yandex.ru'},
      { type: 'other',
        value: 'test@yandex.ru'},
      { type: 'other',
        value: 'test@yandex.ru'},
    ],
    editAndDelete: "Изменить Удалить"
  }
];

async function createControlPanelApp(container, title) {
  //делаем запрос к серверу для получения списка клиентов
  const queryGetList = await getListClients();
  //если в ответ мы получаем массив, то
  if (Array.isArray(queryGetList)) {
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

    //добавляем див заглушка таблицы с анимированным спинером. появляется при долгом ожидаие от сервера при создании нового клиента
    controlPanelBody.after(createElement('div', 'control-panel__spiner'));

    //кнопка добавления клиента
    const btnAddClient = createElement("button", "control-panel__button, btn", "Добавить клиента");
    container.append(btnAddClient);

    //обработчик событий на кнопку "добавить клиента"
    btnAddClient.addEventListener('click', () => eventNewModal(container, arrObjData, controlPanelHead));

    //обработчик событий на всю таблицу для делигирования
    controlPanelBody.addEventListener('click', (event) => eventOnTable(container, arrObjData, controlPanelHead, event));
  //а, если ответ от сервера не массив, то
  } else {
    //отправляем на проверку
    const error = validateErrorsServer(queryGetList);
    container.append(createAppTitle(error.textContent));
  }
};


window.createControlPanelApp = createControlPanelApp;
