'use strict';

//заголовок
export function createAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.classList.add('control-panel__title');
  appTitle.textContent = title;
  return appTitle;
}
//функция создания элемента
//tag - первый параметр, назначаем тег элемента
//className - второй параметр, список классов
//value - третий параметр, значение элемента
export function createElement(tag, className, value) {

  const element = document.createElement(tag);

  if (className) {
    className.trim().split(',').forEach(str => {
      element.classList.add(str.trim());
    });
  }

  if (value) {
    if (typeof value === 'number') {
      element.value = value;
    } else if (typeof value === 'string') {
      element.innerHTML = value;
    }
  }

  return element;
}
//создание таблицы с заголовком
export function createTableThead(title) {
  const table = createElement('table', 'table, control-panel__table');
  const thead = createElement('thead');
  const tr = createElement('tr');
  const entries = Object.entries(title);

  table.append(thead);
  thead.append(tr);
  entries.forEach(element => {
    const th = createElement('th', 'table__head-' + element[0], element[1]);

    tr.append(th);
  });

  return table;
}
//создание тела таблицы
export function createTableTbody(table, arrData){
  const tbody = createElement('tbody');

  arrData.forEach(obj => {
    const tr = createElement('tr');
    tbody.append(tr);
    const entries = Object.entries(obj);

    entries.forEach(element => {
      //если это тип объект, значит это масссив объектов с контактными данными клиента
      if (typeof element[1] === 'object' ) {
        const ul = getListContacts(element[1]); //получаем список всех контактных данных клиента
        const td = createElement('td', 'table__body-' + element[0]);
        td.append(ul);
        tr.append(td);
      } else {
        let td; //переменная для ячеек таблицы
        //ищем значение дат и отделяем от времени. значение времени оборачиваем в span для стилизации
        if (element[0] === 'dateNew' || element[0] === 'dateUpdate') {
          const time = element[1].split(' ')[1];
          const date = element[1].split(' ')[0];
          const span = createElement('span', '', time);
          td = createElement('td', 'table__body-' + element[0], date);
          if (span.textContent.trim() !== 'undefined') {
            td.append(span);
          }
          //проверка на содержание кнопок изменить/удалить. Их тоже помещаем в спан для стилизации
        } else if (element[0] === 'editAndDelete') {
          const editItem = element[1].split(' ')[0];
          const deleteItem = element[1].split(' ')[1];
          const spanEdit = createElement('span', 'table__body-edit', editItem);
          const spanDelete = createElement('span', 'table__body-delete', deleteItem);
          td = createElement('td', 'table__body-' + element[0]);
          td.append(spanEdit, spanDelete);
        } else if (element[0] === 'link') {
          const link = createElement('span', 'table__body-textlink', element[1])
          td = createElement('td', 'table__body-' + element[0]);
          td.append(link);
        } else { //все остальные элементы напрямую в ячейку
          td = createElement('td', 'table__body-' + element[0], element[1]);
        }
        tr.append(td);
      }
    });

  });

  table.append(tbody);

  return table;
}
//получить список контактов клиента
function getListContacts(arrObj) {
  const ul = createElement('ul', 'table__list-contact, list-contact');
  let step = 1;

  arrObj.forEach(obj => {
    if (step < 5) { //если элементов меньше 5, то выводим их сразу
      const li = createElement('li', 'list-contact__' + obj.type);
      //значения помещаем в скрытый див, который будет всплывать при наведении на контакт
      const popup = getPopupOther(li, obj);

      ul.append(popup);
    } else {  //остальным присваиваем класс для их скрытия
      const li = createElement('li', `list-contact__${obj.type}, d-none`);
      const popup = getPopupOther(li, obj);

      ul.append(popup);
    }
    step ++;
  });
  //если есть скрытые елементы списка контактов, создаем еще один для раскрытия остальных
  if (step > 4) {
    const total = (step - 1) - 4;
    const li = createElement('li', 'list-contact__more', '+' + String(total));

    ul.append(li);
  }

  return ul;
}
//формируем попап для елементов списка
function getPopupOther(li, obj) {
  // if (obj.type === "other") {//разбиваем строку на 2 элемента массива, если категория контактов "другие"
  //   const str1 = obj.value.trim().split(" ")[0];
  //   const str2 = obj.value.trim().split(" ")[1];
  //   const link = createElement('a','', str2); //оборачиваем в ссылку вторую часть строки
  //   link.setAttribute('href', `mailto:${str2}`);

  //   const div = createElement('div', 'popup', str1 + " ");
  //   div.append(link);
  //   li.append(div);
  // } else {
  //   const div = createElement('div', 'popup', obj.value);
  //   li.append(div);
  // }

  let valuePopup; //объявляем переменные для записи значений и типов popup
  let typePopup;
  switch(obj.type) {
    case 'phone':
      valuePopup = obj.value;
      typePopup = 'Телефон:'
      break;
    case 'email':
      valuePopup = obj.value;
      typePopup = 'Email:'
      break;
    case 'vk':
      valuePopup = obj.value;
      typePopup = 'VK:'
      break;
    case 'fb':
      valuePopup = obj.value;
      typePopup = 'Facebook:'
      break;
    default:
      valuePopup = obj.value;
      typePopup = 'Другое:'
      break;
  }

  const div = createElement('div', 'popup', typePopup + " ");
  //если есть символ @, значит это Email
  if (Boolean(~valuePopup.indexOf('@'))) {
    const link = createElement('a','link-contact', valuePopup); //оборачиваем в ссылку
    link.setAttribute('href', `mailto:${valuePopup}`);
    div.append(link);
  //если есть совпадение по ".com", значит это ссылка
  } else if (Boolean(~valuePopup.indexOf('.com'))) {
    const link = createElement('a','link-contact', valuePopup);
    link.setAttribute('href', valuePopup);
    div.append(link);
  } else {
    const span = createElement('span', 'text-contact', valuePopup)
    div.append(span);
  }

  li.append(div);
  return li;
}
//создание модального окна
export function createModal(id) {
  const wrapper = createElement('div', 'control-panel__modal, modal');
  const modal = createElement('div', 'modal__content');
  const wrapTitleBlock = createElement('div', 'modal__title-content');
  //заголовок
  let title = '';
  if (id) {
    title = createElement('h3', 'modal__title', 'Изменить данные');
  } else {
    title = createElement('h3', 'modal__title', 'Новый клиент');
  }

  const close = createElement('span', 'modal__close');
  //форма
  const form = createElement('form', 'modal__form');
  form.name = 'formClients';
  //инпуты
  //Фамилия
  const secondName = createInputFormGroup('modal__', 'modal__input-secondName, form-control', 'Фамилия', true, 'secondName');
  //Имя
  const firstName = createInputFormGroup('modal__', 'modal__input-name, form-control', 'Имя', true, 'name');
  //Отчество
  const lastName = createInputFormGroup('modal__', 'modal__input-lastName, form-control', 'Отчество', false, 'lastName');
  //блок добавить контакт
  const wrapAddContactBlock = createElement('div', 'modal__add-contact, add-cotact');
  const btnAddContact = createElement('a', 'add-contact__button, btn', 'Добавить контакт');
  wrapAddContactBlock.append(btnAddContact);
  //кнопка сохранить контакт
  const btnSave = createElement('button', 'modal__button-save, btn', 'Сохранить');
  //кнопка отмена или удалить клиента
  let cansel = '';
  let btnDelete = '';
  if (id) {
    btnDelete = createElement('a', 'modal__button-cansel, btn', 'Удалить клиента');
  } else {
    cansel = createElement('a', 'modal__button-cansel, btn', 'Отмена');
  }

  form.append(secondName, firstName, lastName, wrapAddContactBlock, btnSave);
  if (id) {
    form.append(btnDelete);
  } else {
    form.append(cansel);
  }

  wrapTitleBlock.append(title);
  if (id) {
    wrapTitleBlock.append(createElement('span', 'modal__title-id', `ID: ${id}`));
  }
  wrapTitleBlock.append(close);
  modal.append(wrapTitleBlock, form);
  wrapper.append(modal);

  return {
    btnDelete,
    cansel,
    close,
    btnSave,
    btnAddContact,
    wrapper
  };
}
//модальное окно удаления объекта
export function createModalDelete() {
  const wrapper = createElement('div', 'control-panel__modal, modal');
  const modal = createElement('div', 'modal__content, model__content-delete');
  const wrapTitleBlock = createElement('div', 'modal__title-content');

  //заголовок
  const title = createElement('h3', 'modal__title', 'Удалить клиента');
  const close = createElement('span', 'modal__close');

  //тело
  const content = createElement('p', 'modal__text', 'Вы действительно хотите удалить данного клиента?');
  //кнопка удалить
  const btnDelete = createElement('button', 'modal__button-save, btn', 'Удалить');
  //кнопка отмена
  const cansel = createElement('a', 'modal__button-cansel, btn', 'Отмена');

  wrapTitleBlock.append(title, close);
  modal.append(wrapTitleBlock, content, btnDelete, cansel);
  wrapper.append(modal);

  return {
    close,
    cansel,
    btnDelete,
    wrapper
  };
}
//создаем групу инпут
//classNamePrefix - префикс названия класса родителя
//classNameInput - класс поля ввода
//placeholderValue - значение placeholder
//required - обязательно ли поле к заполнению. Если true, то добаляем звездочку к placeholder
//nameInput - название поле ввода
function createInputFormGroup(classNamePrefix, classNameInput, placeholderValue, required, nameInput = '') {
  const wrapFormGroup = createElement('div', `${classNamePrefix}form-group`);
  const input = createElement('input', classNameInput);
  input.name = nameInput;
  const placeholder = createElement('span', `${classNamePrefix}placeholder`, placeholderValue);
  input.setAttribute('type', 'text');
  if (required) {
    input.setAttribute('required', required);
    const star = createElement('span', `${classNamePrefix}star`, '*');
    placeholder.append(star);
  }
  wrapFormGroup.append(input, placeholder);

  return wrapFormGroup;
}

//группа инпут, объединенная с селект. делаем для выбора типа контактов у селект в модальном окне
export function createGroupSelect(select, value) {
  //контейнер
  const wrapper = createElement('div', 'add-contact__box, input-group');
  //группа для поля ввода
  const wrapInput = createElement('div', 'add-contact__input-group, input-group-append');
  const input = createElement('input', 'add-contact__input, form-control');
  if (value) {
    input.value = value;
  }
  input.placeholder = 'Введите данные контакта';
  input.name = 'data-contact';
  //кнопка удаления, изначально скрыта, если нет переданного аргумента value
  let btn = '';
  if (!value) {
    btn = createElement('a', 'btn, add-contact__btnDelete, d-none');
  } else {
    btn = createElement('a', 'btn, add-contact__btnDelete');
  }
  wrapInput.append(input, btn);
  //объединяем селект с инпут в общий контейнер
  wrapper.append(select, wrapInput);
  //возвращаем контейнер, инпут и кнопку
  return {
    wrapper,
    input,
    btn
  };
}
