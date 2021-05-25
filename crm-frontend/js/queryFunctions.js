'use strict';

import {getProcessedListObj} from "./handlerFunctions.js";

const URL_CLIENTS = 'http://localhost:3000/api/clients';
//список клиентов
export async function getListClients(params) {
  let response;

  if (params) {
    response = await fetch(`${URL_CLIENTS}/?search=${params}`);
  } else {
    response = await fetch(URL_CLIENTS);
  }

  if (response.ok) {
    const result = await response.json();
    const processedListObj = getProcessedListObj(result);

    return processedListObj;
  } else {
    return response.status;
  }
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
  if (response.ok) {
    const result = await response.json();
    const processedObj = getProcessedListObj(result);

    return processedObj;
  } else {
    return response.status;
  }
}
//удаление клиента
export async function deleteClient(id) {
  const response = await fetch(`${URL_CLIENTS}/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return true;
  } else {
    return response.status;
  }
}
//клент по id
export async function getClient(id) {
  const response = await fetch(`${URL_CLIENTS}/${id}`);
  if (response.ok) {
    const client = await response.json();

    return client;
  } else {
    return response.status;
  }
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
  if (response.ok) {
    const result = await response.json();
    const processedObj = getProcessedListObj(result);

    return processedObj;
  } else {
    return response.status;
  }
}
