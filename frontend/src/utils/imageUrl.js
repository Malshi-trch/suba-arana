const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_URL.replace(/\/api\/?$/, '');

export const getImageUrl = (image) => {
  if (!image) return '';

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};