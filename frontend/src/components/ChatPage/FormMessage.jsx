import { useFormik } from 'formik';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import useAuth, { useSocket } from '../../hooks';
import { useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const FormMessage = () => {
  const inputMessage = useRef(null);
  const currentChannelId = useSelector(
    channelsSelectors.SelectCurrentChannelId,
  );
  const socket = useSocket();
  const auth = useAuth();

  useEffect(() => {
    if (inputMessage.current) {
      inputMessage.current.focus();
    }
  });

  const validationSchema = yup.object().shape({
    messageText: yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('values', values);
      const message = {
        body: values.messageText,
        channelId: currentChannelId,
        user: auth.user.username,
      };
      socket.sendMessage(message);
      resetForm();
    },
  });

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
            placeholder="Введите ваше сообщение..."
            aria-label="Новое сообщение"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            value={formik.values.messageText}
          />
          <Button variant="group-vertical" type="submit" disabled={isInvalid}>
            <ArrowRightSquare size={20} />
            <span className="visually-hidden">Отправить</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default FormMessage;
