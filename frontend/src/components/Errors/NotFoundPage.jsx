import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { appPaths } from '../../routes';
import error from '../../assets/404error.png';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <Image
        width="auto"
        height="auto"
        alt="Страница не найдена"
        src={error}
        fluid
      />
      <h1 className="h4 text-muted">{t('notFoundPage')}</h1>
      <p className="text-muted">
        {t('canGo')}{' '}
        <Link to={appPaths.chatPagePath}>{t('backToMainPage')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
