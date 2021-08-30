'use strict';

import { updateTable } from "./handlerFunctions.js";
//переменная для хранения состояния кнопки
let sort = true;
//функция сортировки по id
export function sortId(table, arrObjData, btn) {
  const arrObjSort = arrObjData.slice();

  if (sort) {
    btn.classList.add('is-reverse');
  //обновляем таблицу
    updateTable(table, arrObjSort.sort(( a, b ) => a.id - b.id).reverse());
  } else {
    btn.classList.remove('is-reverse');
    updateTable(table, arrObjSort.sort(( a, b ) => a.id - b.id));
  }
  sort = !sort;
}
//функция сортировки по ФИО
export function sortFullName(table, arrObjData, btn) {
  const arrObjSort = arrObjData.slice();
  //используем компоратор
  function compare(a, b) {
    const genreA = a.name.toUpperCase();
    const genreB = b.name.toUpperCase();

    let comparison = 0;

    if(genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }

    return comparison;
  }

  if (sort) {
    btn.classList.add('is-reverse');
  //обновляем таблицу
    updateTable(table, arrObjSort.sort(compare));
  } else {
    btn.classList.remove('is-reverse');
    updateTable(table, arrObjSort.sort(compare).reverse());
  }
  sort = !sort;
}
//сортировка по дате 
export function sortDate(table, arrObjData, btn) {
  const arrObjSort = arrObjData.slice();
  const sortBy = btn.classList.value.slice().split('-')[1].split(' ')[0]; //сортируем по этому полю
  function compare(a, b) {
    
    //преобразование даты изменения к необходимому формату для возможности сравнения через new Date
    const str1A = a[sortBy].split(' ')[0].split('.');
    const str2A = a[sortBy].split(' ')[1];
    const newFormatA = str1A[2] + '-' + str1A[1] + '-' + str1A[0] + 'T' + str2A;

    const str1B = b[sortBy].split(' ')[0].split('.');
    const str2B = b[sortBy].split(' ')[1];
    const newFormatB = str1B[2] + '-' + str1B[1] + '-' + str1B[0] + 'T' + str2B;

    const genreA = new Date(newFormatA);
    const genreB = new Date(newFormatB);

    let comparison = 0;

    if(genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }

    return comparison;
  }

  if (sort) {
    btn.classList.add('is-reverse');
  //обновляем таблицу
    updateTable(table, arrObjSort.sort(compare));
  } else {
    btn.classList.remove('is-reverse');
    updateTable(table, arrObjSort.sort(compare).reverse());
  }
  sort = !sort;
}
