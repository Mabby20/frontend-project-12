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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import useAuth from '../../hooks';
import { apiRoutes, appPaths } from '../../routes';
import signupImg from '../../assets/signup.png';

const SignupCard = () => {
  const inputUserName = useRef(null);
  const [regFailed, setRegFailed] = useState(false);
  const navigate = useNavigate();
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { logIn } = useAuth();

  useEffect(() => {
    if (inputUserName.current) {
      inputUserName.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputUserName.current && regFailed) {
      inputUserName.current.select();
    }
  }, [regFailed]);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t('validation.required'))
      .min(3, t('validation.lengthWarning'))
      .max(20, t('validation.lengthWarning')),
    password: yup
      .string()
      .required(t('validation.required'))
      .min(6, t('validation.passwordWarning')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('validation.confirmPass')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }) => {
      setRegFailed(false);
      try {
        const { data } = await axios.post(apiRoutes.signupPath(), {
          username,
          password,
        });
        logIn(data);
        navigate(appPaths.chatPagePath);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError) {
          if (err.code === 'ERR_NETWORK') {
            toast.error(t('toastify.reject'));
            rollbar.error('SignupCard', err);
          }
          if (err.response.status === 409) {
            setRegFailed(true);
            rollbar.error('SignupCard', err);
          }
        }
        throw err;
      }
    },
  });

  const isInvalidUsername = formik.touched.username && formik.errors.username;
  const isInvalidPassword = formik.touched.password && formik.errors.password;
  const isInvalidConfirmPassword =
    formik.touched.confirmPassword && formik.errors.confirmPassword;

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
                      placeholder={t('formForSignup.placeholderUsername')}
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
                    <Form.Label htmlFor="username">
                      {t('formForSignup.labelUsername')}
                    </Form.Label>
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
                      placeholder={t('formForSignup.placeholderPassword')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={regFailed || isInvalidPassword}
                      isValid={
                        formik.touched.password && !formik.errors.password
                      }
                      required
                    />
                    <Form.Label htmlFor="password">
                      {t('formForSignup.labelPassword')}
                    </Form.Label>
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
                      placeholder={t(
                        'formForSignup.placeholderConfirmPassword',
                      )}
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
                    <Form.Label htmlFor="confirmPassword">
                      {t('formForSignup.labelConfirmPassword')}
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword ||
                        t('formForSignup.existingUser')}
                    </Form.Control.Feedback>
                  </Form.Floating>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                  >
                    {t('registration')}
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
