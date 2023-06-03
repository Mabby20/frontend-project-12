import { useContext } from 'react';

import authContext, { FilterContext, SocketContext } from '../contexts/index';

const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(SocketContext);
export const useFilter = () => useContext(FilterContext);
export default useAuth;
