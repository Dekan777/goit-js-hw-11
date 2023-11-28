import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_MCbmjbpL2EK0M1ExHHJ0clpK8ztrjpAtYLeQ5PmMGUjuQ3wzfscrLeVh8obG0Lbz';

const API_KEY = '40913963-8e579c79c98d472778d15f639';
const BASE_URL = 'https://pixabay.com/api/';

// Переменная для хранения текущего номера страницы.
let currentPage = 1;

// Переменная для хранения элемента кнопки "Load more"
const loadMoreButton = document.querySelector('.load-more');

// Прослушиватель событий для формы
document.getElementById('search-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const searchQuery = document.getElementById('search-query').value;

  // Используйте fetchDataWithPage с номером текущей страницы.
  await fetchDataWithPage(searchQuery, currentPage);

  // Увеличить номер страницы для последующих запросов.
  currentPage++;

  // Показать кнопку "Load more" после первого запроса
  loadMoreButton.style.display = 'block';
});

// Прослушиватель событий для кнопки "Load more"
loadMoreButton.addEventListener('click', async function () {
  const searchQuery = document.getElementById('search-query').value;

  // Используйте fetchDataWithPage с номером текущей страницы.
  await fetchDataWithPage(searchQuery, currentPage);

  // Увеличить номер страницы для последующих запросов.
  currentPage++;
});

const fetchDataWithPage = async (searchQuery, page) => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40, 
  });

  const fullURL = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(fullURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const images = data.hits.map(image => ({
        id: image.id,
        webformatURL: image.webformatURL,
        largeImageURL: image.largeImageURL,
        tags: image.tags,
        likes: image.likes,
        views: image.views,
        comments: image.comments,
        downloads: image.downloads,
      }));

      // Рендеринг изображений
      renderImages(images);
    }
  } catch (error) {
    console.error('Error:', error);
    Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
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

// Функция для рендеринга карточек изображений
const renderImages = images => {
  const galleryContainer = document.querySelector('.gallery');

  // Очищайте контейнер перед каждым новым запросом
  galleryContainer.innerHTML = '';

  // Создание и добавление карточек изображений в контейнер.
  images.forEach(image => {
    const card = createCardElement(image);
    galleryContainer.appendChild(card);
  });
};

// Изначально скрываем кнопку "Load more"
loadMoreButton.style.display = 'none';
