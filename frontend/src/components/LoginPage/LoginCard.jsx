import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import loginImg from '../../assets/login.jpeg';
import useAuth from '../../hooks';
import { ApiRoutes, appPaths } from '../../routes';

const LoginCard = () => {
  const inputName = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    inputName.current.focus();
  }, []);

  useEffect(() => {
    if (authFailed) {
      inputName.current.select();
    }
  }, [authFailed]);

  const validationSchema = yup.object().shape({
    username: yup.string().trim().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const { data } = await axios.post(ApiRoutes.loginPath(), values);
        auth.logIn(data);
        navigate({ pathname: '/' });
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw err;
      }
    },
  });
  // console.log('errors -', formik.errors);
  // console.log('username errors -', formik.errors.username);
  // console.log('touched -', formik.touched);
  // console.log('username touched -', formik.touched.username);

  const isInvalidUsername = formik.errors.username && formik.touched.username;
  const isInvalidPassword = formik.errors.password && formik.touched.password;

  return (
    <Container className="h-100" fluid>
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col
                xs={12}
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <Image className="rounded-circle" alt="Войти" src={loginImg} />
              </Col>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">Войти</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Floating className="mb-3" controlid="floatingInput">
                    <Form.Control
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Ваш ник"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={authFailed || isInvalidUsername}
                      ref={inputName}
                      required
                    />
                    <Form.Label htmlFor="username">Ваш ник</Form.Label>
                  </Form.Floating>
                  <Form.Floating className="mb-4" controlid="floatingPassword">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      placeholder="Ваш ник"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={authFailed || isInvalidPassword}
                      required
                    />
                    <Form.Label htmlFor="password">Ваш Пароль</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      the username or password is incorrect
                    </Form.Control.Feedback>
                  </Form.Floating>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    Войти
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>{' '}
                <Link to={appPaths.signUpPagePath}>Регистрация</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginCard;
// TODO:
//  -сделать роуты для футера, что бы не хардкодить путь как сейчас - готово
//  -посмотреть как быть с onchange у инпутов
//  -Добавить i18n в яп-шему, в фидбэк
