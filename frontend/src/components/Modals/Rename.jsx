import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const Rename = () => {
  const input = useRef(null);
  const socket = useSocket();
  const dispatch = useDispatch();
  const allChannelNames = useSelector(channelsSelectors.selectAllChannelNames);
  console.log('allChannelNames', allChannelNames);
  const { isOpened, targetId } = useSelector((state) => state.modals);
  console.log(isOpened);

  useEffect(() => {
    input.current.select();
  }, []);

  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .trim()
      .required('обязательное поле')
      .min(3, 'от 3х до 20 символов')
      .max(20, 'от 3х до 20 символов')
      .notOneOf(allChannelNames, 'имя должно быть уникальным'),
  });

  const formik = useFormik({
    initialValues: {
      body: channelNameById,
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ body }) => {
      console.log(body);
      try {
        await socket.renameChannel({
          id: targetId,
          name: body,
        });
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
        <Modal.Title>Переименовать</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="body">
            <Form.Control
              required
              type="text"
              ref={input}
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

export default Rename;
