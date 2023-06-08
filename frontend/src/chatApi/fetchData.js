import axios from 'axios';
import { apiRoutes } from '../routes';

export default async (header) => {
  const authHeader = { headers: header };
  const { data } = await axios.get(apiRoutes.dataPath(), authHeader);
  return data;
};
