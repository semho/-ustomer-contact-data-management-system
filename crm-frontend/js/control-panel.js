'use strict';

import {createAppTitle, createTableThead, createTableTbody, createElement} from "./createElements.js";
import {eventNewModal, eventOnTable, debounce, onChange} from "./handlerFunctions.js";
import {getListClients} from "./queryFunctions.js";
import {validateErrorsServer} from "./validators.js";
import {sortId, sortFullName, sortDateCreate, sortDateUpdate} from "./sorts.js";

//массив для хранения объектов клиента, объект как пример
let arrObjData = [
  {id: "123456", name: "Скворцов Денис Юрьевич", dateNew: "21.02.2021 10:00", dateUpdate: "21.02.2021 10:00", contacts:
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
  //заголовок приложения
  const controlPanelTitle = createAppTitle(title);
  container.append(controlPanelTitle);

  //заголовки колонок таблицы
  const titleTable = {id: "ID", name: "Фамилия Имя Отчество", dateNew: "Дата и время создания", dateUpdate: "Последние изменения", contacts: "Контакты", action: "Действия"};
  const controlPanelHead = createTableThead(titleTable);
  container.append(controlPanelHead);

  //добавляем див заглушка таблицы с анимированным спинером.
  controlPanelHead.classList.add('loading');
  controlPanelHead.append(createElement('div', 'control-panel__spiner'));
  //делаем запрос к серверу для получения списка клиентов
  const queryGetList = await getListClients();

  //удаляем заглушку предзагрузки
  controlPanelHead.classList.remove('loading');

  //если в ответ мы получаем массив, то
  if (Array.isArray(queryGetList)) {
    //добавляем наш список объектов к исходному списку
    arrObjData.push(...queryGetList);

    //тело таблицы
    const controlPanelBody = createTableTbody(controlPanelHead, arrObjData);
    container.append(controlPanelBody);
    //controlPanelBody.after(createElement('div', 'control-panel__spiner'));

    //кнопка добавления клиента
    const btnAddClient = createElement("button", "control-panel__button, btn", "Добавить клиента");
    container.append(btnAddClient);

    //обработчик событий на кнопку "добавить клиента"
    btnAddClient.addEventListener('click', () => eventNewModal(container, arrObjData, controlPanelHead));

    //обработчик событий на всю таблицу для делигирования
    controlPanelBody.addEventListener('click', (event) => eventOnTable(container, arrObjData, controlPanelHead, event));

    //сортировка по id
    const titleId = controlPanelHead.querySelector('.table__head-id');
    titleId.addEventListener('click', () => sortId(controlPanelBody, arrObjData, titleId));
    //сортировка по ФИО
    const titleFullName = controlPanelHead.querySelector('.table__head-name');
    titleFullName.addEventListener('click', () => sortFullName(controlPanelBody, arrObjData, titleFullName));
    //сортировка по дате создания
    const titleDateCreate = controlPanelHead.querySelector('.table__head-dateNew');
    titleDateCreate.addEventListener('click', () => sortDateCreate(controlPanelBody, arrObjData, titleDateCreate));
    //сортировка по дате обновления
    const titleDateUpdate = controlPanelHead.querySelector('.table__head-dateUpdate');
    titleDateUpdate.addEventListener('click', () => sortDateUpdate(controlPanelBody, arrObjData, titleDateUpdate));

    //вешаем обработчик событий на инпут. создаем функцию debounce
    const inputSearch = document.querySelector('.header__input');
    //inputSearch.addEventListener('change', () => timeDelay(inputSearch, controlPanelHead, arrObjData));
    const onChangeDebounce = debounce(onChange, 300);
    inputSearch.addEventListener('input', onChangeDebounce);
    

  //а, если ответ от сервера не массив, то
  } else {
    //отправляем на проверку
    const error = validateErrorsServer(queryGetList);
    container.append(createAppTitle(error.textContent));
  }
};


window.createControlPanelApp = createControlPanelApp;
