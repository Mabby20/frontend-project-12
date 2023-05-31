import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return auth.user ? (
    <Button className="btn-primary" onClick={auth.logOut}>
      {t('logOut')}
    </Button>
  ) : null;
};

export default AuthButton;
