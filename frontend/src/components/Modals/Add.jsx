import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';

const Add = () => {
  const inputRef = useRef(null);
  const socket = useSocket();
  const dispatch = useDispatch();
  const allChannelNames = useSelector(channelsSelectors.selectAllChannelNames);
  console.log('allChannelNames', allChannelNames);
  const isOpened = useSelector((state) => state.modals.isOpened);
  console.log(isOpened);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .trim()
      .required()
      .min(3, 'от 3х до 20 символов')
      .max(20, 'от 3х до 20 символов')
      .notOneOf(allChannelNames, 'имя должно быть уникальным'),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: ({ body }) => {
      console.log(body);
      try {
        socket.addNewChannel({ name: body });
        dispatch(modalsActions.close());

        // сделать вывод всплывающих окон - тоастифай.
      } catch (err) {
        // если ошибка тоже выводить в сплывающие
        console.log(err);
      }
    },
  });

  const handleClose = () => {
    dispatch(modalsActions.close());
  };

  const isNameInvalid = formik.errors.body && formik.touched.body;

  return (
    <Modal show={isOpened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="body">
            <Form.Control
              required
              type="text"
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              isInvalid={isNameInvalid}
              disabled={formik.isSubmitting}
              name="body"
            />
            <Form.Label visuallyHidden>Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.body}
            </Form.Control.Feedback>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Отменить
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
              >
                Отправить
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;

// todo
//  - выводить всплывающие окна при создании, и при ошибке.
//  - перевести весь текст на интернационализацию.
