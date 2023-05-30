import { useContext } from 'react';

import authContext, { SocketContext } from '../contexts/index';

const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(SocketContext);
export default useAuth;
