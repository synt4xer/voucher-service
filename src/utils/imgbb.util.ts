import axios from 'axios';
import { logger } from './logger';
import { AppConstant } from './app-constant';

const BASE_URL = `https://api.imgbb.com/1/upload?key=${AppConstant.IMGBB_API_V1_KEY}`;

export const uploadImage = async (imageFile: any) => {
  const formData = new FormData();

  const { data, name, md5, mimetype } = imageFile.image;

  const imageBlob = new Blob([data], { type: mimetype });

  formData.append('image', imageBlob, name);
  formData.append('name', md5);

  try {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url; // Assuming the API returns the URL of the uploaded image
  } catch (error) {
    logger.error('imgbb.uploadImage.error', error);
    throw error;
  }
};
