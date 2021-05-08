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
  let step = 1;

  table.append(thead);
  thead.append(tr);
  entries.forEach(element => {
    const th = createElement('th', 'table__head-' + element[0], element[1]);

    if (step === 6) { //если колонка под номером 6, то объединяем ее с 7
      th.setAttribute('colspan', '2');
    }

    tr.append(th);
    step ++;
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
        const td = createElement('td', 'table__body-' + element[0], element[1]);
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
    const entries = Object.entries(obj);

    entries.forEach(values => {
      if (step < 5) { //если элементов меньше 5, то выводим их сразу
        const li = createElement('li', 'list-contact__' + values[0]);
        //значения помещаем в скрытый див, который будет всплывать при наведении на контакт
        const popup = getPopupOther(li, values);

        ul.append(popup);
      } else { //остальным присваиваем класс для их скрытия
        const li = createElement('li', `list-contact__${values[0]}, d-none`);
        const popup = getPopupOther(li, values);

        ul.append(popup);
      }
    })
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
function getPopupOther(li, values) {
  if (values[0] === "other") { //разбиваем строку на 2 элемента массива, если категория контактов "другие"
    const str1 = values[1].trim().split(" ")[0];
    const str2 = values[1].trim().split(" ")[1];
    const link = createElement('a','', str2); //оборачиваем в ссылку вторую часть строки
    link.setAttribute('href', `mailto:${str2}`);

    const div = createElement('div', 'popup', str1 + " ");
    div.append(link);
    li.append(div);
  } else {
    const div = createElement('div', 'popup', values[1]);
    li.append(div);
  }

  return li;
}
//создание модального окна
export function createModal() {
  const wrapper = createElement('div', 'control-panel__modal, modal');
  const modal = createElement('div', 'modal__content');
  const wrapTitleBlock = createElement('div', 'modal__title-content');
  //заголовок
  const title = createElement('h3', 'modal__title', 'Новый клиент');
  const close = createElement('span', 'modal__close');
  //форма
  const form = createElement('form', 'modal__form');
  //инпуты
  //Фамилия
  const secondName = createInputFormGroup('modal__', 'modal__input-secondName, form-control', 'Фамилия', true);
  //Имя
  const firstName = createInputFormGroup('modal__', 'modal__input-name, form-control', 'Имя', true);
  //Отчество
  const lastName = createInputFormGroup('modal__', 'modal__input-lastName, form-control', 'Отчество');
  //блок добавить контакт
  const wrapAddContactBlock = createElement('div', 'modal__add-contact, add-cotact');
  const btnAddContact = createElement('a', 'add-contact__button, btn', 'Добавить контакт');
  wrapAddContactBlock.append(btnAddContact);
  //кнопка сохранить контакт
  const btnSaveContact = createElement('button', 'modal__button-save, btn', 'Сохранить');
  //кнопка отмена
  const cansel = createElement('a', 'modal__button-cansel, btn', 'Отмена');


  form.append(secondName, firstName, lastName, wrapAddContactBlock, btnSaveContact, cansel);
  wrapTitleBlock.append(title, close);
  modal.append(wrapTitleBlock, form);
  wrapper.append(modal);

  return {
    cansel,
    close,
    btnAddContact,
    wrapper
  };
}
//создаем групу инпут
//classNamePrefix - префикс названия класса родителя
//classNameInput - класс поля ввода
//placeholderValue - значение placeholder
//required - обязательно ли поле к заполнению. Если true, то добаляем звездочку к placeholder
function createInputFormGroup(classNamePrefix, classNameInput, placeholderValue, required) {
  const wrapFormGroup = createElement('div', `${classNamePrefix}form-group`);
  const input = createElement('input', classNameInput);
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
export function createGroupSelect(select) {
  //контейнер
  const wrapper = createElement('div', 'add-contact__box, input-group');
  //группа для поля ввода
  const wrapInput = createElement('div', 'add-contact__input-group, input-group-append');
  const input = createElement('input', 'add-contact__input, form-control');
  input.placeholder = 'Введите данные контакта';
  //кнопка удаления, изначально скрыта
  const btn = createElement('a', 'btn, add-contact__btnDelete, d-none');
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
