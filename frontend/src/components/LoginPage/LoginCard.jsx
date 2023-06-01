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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import loginNewImg from '../../assets/loginNew.png';
import useAuth from '../../hooks';
import { ApiRoutes, appPaths } from '../../routes';

const LoginCard = () => {
  const { t } = useTranslation();
  const inputName = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const { logIn } = useAuth();

  useEffect(() => {
    inputName.current.focus();
  }, []);

  useEffect(() => {
    if (authFailed) {
      inputName.current.select();
    }
  }, [authFailed]);

  const validationSchema = yup.object().shape({
    username: yup.string().trim().required(t('validation.required')),
    password: yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const { data } = await axios.post(ApiRoutes.loginPath(), values);
        logIn(data);
        navigate(appPaths.chatPagePath);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError) {
          if (err.code === 'ERR_NETWORK') {
            toast.error(t('toastify.reject'));
          }
          if (err.response.status === 401) {
            setAuthFailed(true);
          }
        }
        throw err;
      }
    },
  });

  const isInvalidUsername = formik.touched.username && formik.errors.username;
  const isInvalidPassword = formik.touched.password && formik.errors.password;

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
                <Image
                  className="rounded-circle"
                  with={200}
                  height={200}
                  alt="Войти"
                  src={loginNewImg}
                />
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
                      placeholder={t('formForLogin.placeholderUsername')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={authFailed || isInvalidUsername}
                      ref={inputName}
                      required
                    />
                    <Form.Label htmlFor="username">
                      {t('formForLogin.labelUsername')}
                    </Form.Label>
                  </Form.Floating>
                  <Form.Floating className="mb-4" controlid="floatingPassword">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      placeholder={t('formForLogin.placeholderPassword')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={authFailed || isInvalidPassword}
                      required
                    />
                    <Form.Label htmlFor="password">
                      {t('formForLogin.labelPassword')}
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password ||
                        t('formForLogin.invalidUserData')}
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
                <span>{t('hasAccount')}</span>{' '}
                <Link to={appPaths.signUpPagePath}>
                  {t('textRegistration')}
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginCard;
