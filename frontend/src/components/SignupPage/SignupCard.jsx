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
import * as yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks';
import { ApiRoutes, appPaths } from '../../routes';
import signupImg from '../../assets/signup.png';

const SignupCard = () => {
  const inputUserName = useRef(null);
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [regFailed, setRegFailed] = useState(false);

  useEffect(() => {
    inputUserName.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required('обязательное поле')
      .min(3, 'от 3 до 20 символов')
      .max(20, 'от 3 до 20 символов'),
    password: yup
      .string()
      .required('обязательное поле')
      .min(6, 'не менее 6 символов'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'пароли должны совпадать'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async ({ username, password }) => {
      setRegFailed(false);
      try {
        const { data } = await axios.post(ApiRoutes.signupPath(), {
          username,
          password,
        });
        logIn(data);
        navigate(appPaths.chatPagePath);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setRegFailed(true);
          console.error(err);
          return;
        }
        throw err;
      }
    },
  });

  console.log('formik', formik);
  const isInvalidUsername = formik.touched.username && formik.errors.username;
  const isInvalidPassword = formik.touched.password && formik.errors.password;
  const isInvalidConfirmPassword =
    formik.errors.confirmPassword && formik.touched.confirmPassword;

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
                  width={200}
                  height={200}
                  className="rounded-circle"
                  alt="Войти"
                  src={signupImg}
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
                      placeholder="Имя пользователя"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={regFailed || isInvalidUsername}
                      isValid={
                        formik.touched.username && !formik.errors.username
                      }
                      ref={inputUserName}
                      required
                    />
                    <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Floating>
                  <Form.Floating className="mb-4" controlid="floatingPassword">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      placeholder="Пароль"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={regFailed || isInvalidPassword}
                      isValid={
                        formik.touched.password && !formik.errors.password
                      }
                      required
                    />
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Floating>
                  <Form.Floating className="mb-4" controlid="floatingPassword">
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="password"
                      placeholder="Подтвердите пароль"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      isInvalid={regFailed || isInvalidConfirmPassword}
                      isValid={
                        formik.touched.confirmPassword &&
                        !formik.errors.confirmPassword
                      }
                      required
                    />
                    <Form.Label htmlFor="password">
                      Подтвердите Пароль
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword ||
                        'такой пользователь уже зарегестрирован'}
                    </Form.Control.Feedback>
                  </Form.Floating>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    Зарегестрироваться
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupCard;
