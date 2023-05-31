import ReactDOM from 'react-dom/client';
import './styles/application.scss';

import init from './init';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(await init());
};

app();
