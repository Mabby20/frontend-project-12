import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import filter from 'leo-profanity';
import AuthProvider from './contexts/AuthProvider';
import App from './components/App';
import store from './slices';
import SocketProvider from './contexts/SocketProvider';
import resources from './locales/index.js';
import { FilterContext } from './contexts/index';

const init = async () => {
  const badWordsRu = filter.getDictionary('ru');
  filter.add(badWordsRu);

  const filterBadWord = (word) => filter.clean(word);

  const websocket = io();
  const i18n = i18next.createInstance();

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: process.env.NODE_ENV,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

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
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <SocketProvider socket={websocket}>
            <AuthProvider>
              <FilterContext.Provider value={filterBadWord}>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </FilterContext.Provider>
            </AuthProvider>
          </SocketProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
