import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { appPaths } from '../../routes';
import errorImg from '../../assets/error.svg';

const NotFoundPage = () => (
  <div className="text-center">
    <Image className="h-25" alt="Страница не найдена" src={errorImg} fluid />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти{' '}
      <Link to={appPaths.chatPagePath}>на главную страницу</Link>
    </p>
  </div>
);

export default NotFoundPage;
