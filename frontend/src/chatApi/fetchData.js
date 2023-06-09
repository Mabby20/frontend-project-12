import axios from 'axios';
import { apiRoutes } from '../routes';

export default async (headers) => {
  const { data } = await axios.get(apiRoutes.dataPath(), headers);
  return data;
};
