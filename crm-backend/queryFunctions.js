'use strict';

import {getProcessedListObj} from "./handlerFunctions.js";

const URL_CLIENTS = 'http://localhost:3000/api/clients';
//список клиентов
export async function getListClients() {
  const response = await fetch(URL_CLIENTS);
  const result = await response.json();
  const processedListObj = getProcessedListObj(result);

  return processedListObj;
}
//добавление клиента
export async function createClient(client) {
  const response = await fetch(URL_CLIENTS, {
    method: 'POST',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const result = await response.json();
  const processedObj = getProcessedListObj(result);

  return processedObj;
}
//удаление клиента
export async function deleteClient(id) {
  fetch(`${URL_CLIENTS}/${id}`, {
    method: 'DELETE',
  });
}
//клент по id
export async function getClient(id) {
  const response = await fetch(`${URL_CLIENTS}/${id}`);
  const client = await response.json();

  return client;
}
//изменение клиента
export async function editClient(client, id) {
  const response = await fetch(`${URL_CLIENTS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(client),
    headers: {
      'Content-Type':'application/json',
    }
  });
  const result = await response.json();
  const processedObj = getProcessedListObj(result);

  return processedObj;
}
