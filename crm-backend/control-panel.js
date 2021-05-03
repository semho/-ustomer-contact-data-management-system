'use strict';

import {createAppTitle} from "./createElements.js";

function createControlPanelApp(container, title) {
  const controlPanelTitle = createAppTitle(title); //заголовок приложения
  container.append(controlPanelTitle);
};

window.createControlPanelApp = createControlPanelApp;
