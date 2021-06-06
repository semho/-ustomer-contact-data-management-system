'use strict';

import {updateTable} from "./handlerFunctions.js";

//собираем ответ всех фильтров на поисковую строку и отображаем таблицу
export function showSearch(valueSearch, controlPanelHead, arrObjData) {
  //фильтр на ФИО
  const filteredByName = filterByName(valueSearch, arrObjData);
  //фильтр по дате создания
  const filteredByCreationDate = filterByCreationDate(valueSearch, arrObjData);
  //фильтр по дате редактирования
  const filteredByEditDate = filterByEditDate(valueSearch, arrObjData);

  //условия отображения поисковой фразы
  if (filteredByName.filter(i => i.constructor.name === "Object").length > 0) {
    updateTable(controlPanelHead, filteredByName);
  } else if (filteredByCreationDate.filter(i => i.constructor.name === "Object").length > 0) {
    updateTable(controlPanelHead, filteredByCreationDate);
  } else {
    updateTable(controlPanelHead, filteredByEditDate);
  }
}

//фильтр на ФИО
function filterByName(valueSearch, array) {
  if (!valueSearch) {
    return array;
  }
  return array.slice().filter(element =>
    //Фамилия
    (element.name.split(" ")[0].toLowerCase() === valueSearch.toLowerCase().trim())
    //или имя
    || (element.name.split(" ")[1].toLowerCase() === valueSearch.toLowerCase().trim())
    //или отчество
    || (element.name.split(" ")[2].toLowerCase() === valueSearch.toLowerCase().trim())
    //фамилия и имя
    || ((element.name.split(" ")[0].toLowerCase() + element.name.split(" ")[1].toLowerCase()) === valueSearch.toLowerCase().trim().replaceAll(" ",''))
    //имя и отчество
    || ((element.name.split(" ")[1].toLowerCase() + element.name.split(" ")[2].toLowerCase()) === valueSearch.toLowerCase().trim().replaceAll(" ",''))
    //или все вместе
    || (element.name.toLowerCase().replaceAll(" ",'') === valueSearch.toLowerCase().trim().replaceAll(" ",''))
  );

}

//фильтр по дате создания
function filterByCreationDate(valueSearch, array) {
  if (!valueSearch) {
    return array;
  }
  return array.slice().filter(element => element.dateNew.split(" ")[0] === valueSearch.trim())
}

//фильтр по дате редактирования
function filterByEditDate(valueSearch, array) {
  if (!valueSearch) {
    return array;
  }
  return array.slice().filter(element => element.dateUpdate.split(" ")[0] === valueSearch.trim())
}
