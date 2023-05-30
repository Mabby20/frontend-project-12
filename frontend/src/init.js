import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import AuthProvider from './contexts/AuthProvider';
import App from './components/App';
import store from './slices';
import SocketProvider from './contexts/SocketProvider';

const websocket = io();
const init = () => (
  <Provider store={store}>
    <SocketProvider socket={websocket}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SocketProvider>
  </Provider>
);

export default init;
