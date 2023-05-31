import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import AuthProvider from './contexts/AuthProvider';
import App from './components/App';
import store from './slices';
import SocketProvider from './contexts/SocketProvider';
import resources from './locales/index.js';

const init = async () => {
  const websocket = io();
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <Provider store={store}>
      <SocketProvider socket={websocket}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </AuthProvider>
      </SocketProvider>
    </Provider>
  );
};

export default init;
