// // apiService.js

// import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// axios.defaults.headers.common['x-api-key'] =
//   'live_MCbmjbpL2EK0M1ExHHJ0clpK8ztrjpAtYLeQ5PmMGUjuQ3wzfscrLeVh8obG0Lbz';
// const API_KEY = '40913963-8e579c79c98d472778d15f639';
// const BASE_URL = 'https://pixabay.com/api/';

// const fetchData = async searchQuery => {
//   const params = new URLSearchParams({
//     key: API_KEY,
//     q: searchQuery,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   });

//   const fullURL = `${BASE_URL}?${params.toString()}`;

//   try {
//     const response = await fetch(fullURL);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (data.hits.length === 0) {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       const images = data.hits.map(image => ({
//         id: image.id,
//         webformatURL: image.webformatURL,
//         largeImageURL: image.largeImageURL,
//         tags: image.tags,
//         likes: image.likes,
//         views: image.views,
//         comments: image.comments,
//         downloads: image.downloads,
//       }));

//       console.log(images);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     Notify.failure(
//       'An error occurred while fetching images. Please try again later.'
//     );
//   }
// };

// export default fetchData;
