import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_MCbmjbpL2EK0M1ExHHJ0clpK8ztrjpAtYLeQ5PmMGUjuQ3wzfscrLeVh8obG0Lbz';

const API_KEY = '40913963-8e579c79c98d472778d15f639';
const BASE_URL = 'https://pixabay.com/api/';

const searchTerm = 'text';

const params = {
  key: API_KEY,
  q: searchTerm,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

// Создание строки параметров запроса
const queryParams = new URLSearchParams(params).toString();

// Формирование полного URL запроса
const fullURL = `${BASE_URL}?${queryParams}`;

// Выполнение запроса к API Pixabay
fetch(fullURL)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.hits.length === 0) {
      // Если массив изображений пуст, показываем уведомление
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      // Обработка полученных данных
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
  
      // Вывод результатов в консоль (или обработка их другим способом)
      console.log(images);
    }
  })
  .catch(error => {
    // Обработка ошибок
    console.error('Error:', error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
  });