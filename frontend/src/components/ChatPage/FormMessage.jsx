import { useFormik } from 'formik';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import useAuth, { useSocket } from '../../hooks';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const FormMessage = () => {
  const inputMessage = useRef(null);
  const rollbar = useRollbar();
  const auth = useAuth();
  const socket = useSocket();
  const currentChannelId = useSelector(
    channelsSelectors.selectCurrentChannelId,
  );
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    messageText: yup.string().trim().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const message = {
        body: values.messageText,
        channelId: currentChannelId,
        user: auth.user.username,
      };
      try {
        await socket.sendMessage(message);
        resetForm();
      } catch (err) {
        toast.error(t('toastify.reject'));
        rollbar.error('AddChannel', err);
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (inputMessage.current) {
      inputMessage.current.focus();
    }
  }, [currentChannelId]);

  useEffect(() => {
    if (formik.values.messageText === '') {
      inputMessage.current.focus();
    }
  }, [formik.values.messageText]);

  const isInvalid = !formik.dirty || !formik.isValid;
  return (
    <div className="mt-auto px-5 py-3">
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        className="py-1 border rounded-2"
      >
        <InputGroup hasValidation={isInvalid}>
          <Form.Control
            ref={inputMessage}
            className="border-0 p-0 ps-2"
            name="messageText"
            type="text"
            placeholder={t('formForMessage.placeholder')}
            aria-label={t('formForMessage.ariaLabel')}
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            value={formik.values.messageText}
          />
          <Button variant="group-vertical" type="submit" disabled={isInvalid}>
            <ArrowRightSquare size={20} />
            <span className="visually-hidden">{t('send')}</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default FormMessage;
