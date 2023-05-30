import { Button } from 'react-bootstrap';
import useAuth from '../../hooks';

const AuthButton = () => {
  const auth = useAuth();
  return auth.user ? (
    <Button className="btn-primary" onClick={auth.logOut}>
      Log out
    </Button>
  ) : null;
};

export default AuthButton;
