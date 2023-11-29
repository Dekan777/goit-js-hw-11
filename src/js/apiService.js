// api.js

const API_KEY = '40913963-8e579c79c98d472778d15f639';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchDataWithPage = async (searchQuery, page) => {
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
      return { error: 'No images found' };
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

      return { data: images, totalHits: data.totalHits };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred while fetching images' };
  }
};
