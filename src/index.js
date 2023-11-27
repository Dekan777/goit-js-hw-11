import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// main.js

import fetchData from './js/apiService';

// Добавление обработчика события для формы
document
  .getElementById('search-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById('search-query').value;
    await fetchData(searchQuery);
  });
