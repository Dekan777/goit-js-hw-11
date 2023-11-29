import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchDataWithPage } from './js/apiService';

axios.defaults.headers.common['x-api-key'] =
  'live_MCbmjbpL2EK0M1ExHHJ0clpK8ztrjpAtYLeQ5PmMGUjuQ3wzfscrLeVh8obG0Lbz';

// Переменная для хранения текущего номера страницы.
let currentPage = 1;

// Переменная для хранения элемента кнопки "Load more"
const loadMoreButton = document.querySelector('.load-more');
// Изначально скрываем кнопку "Load more"
loadMoreButton.style.display = 'none';

// Прослушиватель событий для формы
document
  .getElementById('search-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById('search-query').value;

    // Проверка на отправку пустой формы
    if (!searchQuery.trim()) {
      Notify.failure('Please enter a search query.');
      return;
    }

    // Сбросить текущую страницу при новом поиске
    currentPage = 1;

    // Используйте fetchDataWithPage с номером текущей страницы.
    fetchDataWithPage(searchQuery, currentPage).then(handleData);

    // Увеличить номер страницы для последующих запросов.
    currentPage++;

    // Показать кнопку "Load more" после первого запроса
    loadMoreButton.style.display = 'block';
  });

// Прослушиватель событий для кнопки "Load more"
loadMoreButton.addEventListener('click', function () {
  const searchQuery = document.getElementById('search-query').value;

  // Используйте fetchDataWithPage с номером текущей страницы.
  fetchDataWithPage(searchQuery, currentPage).then(handleData);

  // Увеличить номер страницы для последующих запросов.
  currentPage++;
});

// Прослушиватель событий для кнопки "Search"
document
  .querySelector('.search-form__btn')
  .addEventListener('click', function () {
    const searchQuery = document.getElementById('search-query').value;

    // Проверка на отправку пустой формы
    if (!searchQuery.trim()) {
      return;
    }

    // Сбросить текущую страницу при новом поиске
    currentPage = 1;

    // Используйте fetchDataWithPage с номером текущей страницы.
    fetchDataWithPage(searchQuery, currentPage).then(data => {
      handleData(data);
      // Увеличить номер страницы для последующих запросов.
      currentPage++;

      // Показать кнопку "Load more" после первого запроса
      loadMoreButton.style.display = 'block';
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    });
  });

const handleData = data => {
  if (data.error) {
    Notify.failure(data.error);
  } else {
    // Рендеринг и добавление карточек изображений в контейнер.
    appendImagesToGallery(data.data);

    // Проверка свойства totalHits
    if (data.data.length === data.totalHits) {
      // Скрыть кнопку "Load more"
      loadMoreButton.style.display = 'none';

      // Вывести уведомление о достижении конца результатов поиска
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }
};

// Функция для создания элемента для карточки изображения
const createCardElement = image => {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info');

  // Функция для создания элемента информации
  const createInfoElement = (label, value) => {
    const infoItem = document.createElement('p');
    infoItem.classList.add('info-item');
    infoItem.innerHTML = `<b>${label}:</b> ${value}`;
    return infoItem;
  };

  const likes = createInfoElement('Likes', image.likes);
  const views = createInfoElement('Views', image.views);
  const comments = createInfoElement('Comments', image.comments);
  const downloads = createInfoElement('Downloads', image.downloads);

  infoContainer.appendChild(likes);
  infoContainer.appendChild(views);
  infoContainer.appendChild(comments);
  infoContainer.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(infoContainer);

  return card;
};

// Функция для рендеринга карточек изображений и добавления их в контейнер
const appendImagesToGallery = images => {
  const galleryContainer = document.querySelector('.gallery');

  // Создание и добавление карточек изображений в контейнер.
  images.forEach(image => {
    const card = createCardElement(image);
    galleryContainer.appendChild(card);
  });
};
