import axios from 'axios';
import { ApiRoutes } from '../routes';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('user'));

  return userId && userId.token
    ? { Authorization: `Bearer ${userId.token}` }
    : {};
};

export default async () => {
  const authHeader = { headers: getAuthHeader() };
  const { data } = await axios.get(ApiRoutes.dataPath(), authHeader);
  // console.log('data in fetchData', data);
  return data;
};
