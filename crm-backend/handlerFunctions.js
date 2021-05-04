'use strict';

//показываем скрытые контакты
export function showContacts() {
  event.preventDefault();
  this.parentElement.querySelectorAll('.d-none').forEach(li => {
    li.classList.remove('d-none');
  })
  this.remove();
}
