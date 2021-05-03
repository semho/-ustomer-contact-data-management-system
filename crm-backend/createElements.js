'use strict';

//заголовок
export function createAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.classList.add('control-panel__title');
  appTitle.innerHTML = title;
  return appTitle;
}
