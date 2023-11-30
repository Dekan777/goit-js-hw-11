import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchDataWithPage } from './js/apiService';
import { clearGallery } from './js/load-more';

const searchFormBtn = document.querySelector('.search-form__btn');
const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');

loadMoreButton.style.display = 'none';
let currentPage = 1;

// Создаем экземпляр SimpleLightbox
// const lightbox = new SimpleLightbox('.gallery a');

const lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    close: false,
    spinner: true,
    showCounter: false,
    animationSlide: false,
    preloading: true,
    enableZoom: true,
    docClose: true,
    swipeClose: true,
    disableRightClick: false,
  });

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchQuery = document.getElementById('search-query').value;

  // Проверка на отправку пустой формы
  if (!searchQuery.trim()) {
    return;
  }

  // Сделать кнопку неактивной
  searchFormBtn.disabled = true;

  // Сбросить текущую страницу при новом поиске
  currentPage = 1;

  // Очистить предыдущие результаты и пересоздать галерею
  clearGallery();
  lightbox.refresh();

  // Используйте fetchDataWithPage с номером текущей страницы.
  fetchDataWithPage(searchQuery, currentPage).then(data => {
    handleData(data);

    // Увеличить номер страницы для последующих запросов.
    currentPage++;

    // Показать кнопку "Load more" после первого запроса
    loadMoreButton.style.display = 'block';
    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    // Сделать кнопку снова активной
    searchFormBtn.disabled = false;
  });
});

// Прослушиватель событий для кнопки "Load more"
loadMoreButton.addEventListener('click', function () {
  const searchQuery = document.getElementById('search-query').value;

  // Используйте fetchDataWithPage с номером текущей страницы.
  fetchDataWithPage(searchQuery, currentPage).then(data => {
    handleData(data);
    lightbox.refresh(); // Обновляем галерею после добавления новых карточек

    // Увеличить номер страницы для последующих запросов.
    currentPage++;
  });
});

// Прослушиватель событий для кнопки "Search"
searchFormBtn.addEventListener('click', function () {
  const searchQuery = document.getElementById('search-query').value;

  // Проверка на отправку пустой формы
  if (!searchQuery.trim()) {
    Notify.failure('Please enter a search query.');
    return;
  }

  // Сделать кнопку неактивной
  searchFormBtn.disabled = true;

  // Сбросить текущую страницу при новом поиске
  currentPage = 1;

  // Очистить предыдущие результаты и пересоздать галерею
  clearGallery();
  lightbox.refresh();

  // Используйте fetchDataWithPage с номером текущей страницы.
  fetchDataWithPage(searchQuery, currentPage).then(data => {
    handleData(data);

    // Увеличить номер страницы для последующих запросов.
    currentPage++;

    // Показать кнопку "Load more" после первого запроса
    loadMoreButton.style.display = 'block';
    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    // Сделать кнопку снова активной
    searchFormBtn.disabled = false;
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
  // Создаем ссылку и оборачиваем в нее карточку изображения
  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.title = image.tags;
  link.appendChild(createCard(image));

  return link;
};

// Функция для создания элемента карточки изображения
const createCard = image => {
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

  // Вызов метода refresh() после добавления новых карточек изображений
  lightbox.refresh();
};
