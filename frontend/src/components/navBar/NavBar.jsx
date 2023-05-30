import { Container, Navbar } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import AuthButton from './AuthButton';
import { appPaths } from '../../routes';

const NavBar = () => {
  const fist = 'f';
  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to={appPaths.chatPagePath}>
            Hexlet Chat
          </Navbar.Brand>
          <AuthButton />
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default NavBar;
