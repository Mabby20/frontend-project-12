import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { appPaths } from '../../routes';
import errorImg from '../../assets/error.svg';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <Image className="h-25" alt="Страница не найдена" src={errorImg} fluid />
      <h1 className="h4 text-muted">{t('notFoundPage')}</h1>
      <p className="text-muted">
        {t('canGo')}{' '}
        <Link to={appPaths.chatPagePath}>{t('backToMainPage')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
