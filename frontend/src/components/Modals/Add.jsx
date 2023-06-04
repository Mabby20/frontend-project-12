import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';

const Add = () => {
  const inputRef = useRef(null);
  const rollbar = useRollbar();
  const socket = useSocket();
  const dispatch = useDispatch();
  const allChannelNames = useSelector(channelsSelectors.selectAllChannelNames);
  const isOpened = useSelector((state) => state.modals.isOpened);
  const { t } = useTranslation();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .trim()
      .required(t('validation.required'))
      .min(3, t('validation.lengthWarning'))
      .max(20, t('validation.lengthWarning'))
      .notOneOf(allChannelNames, t('validation.uniqueName')),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ body }) => {
      try {
        await socket.addNewChannel({ name: body });
        dispatch(modalsActions.close());
        toast.success(t('toastify.successAddChannel'));
      } catch (err) {
        toast.error(t('toastify.reject'));
        rollbar.error('AddChannel', err);
        console.error(err);
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
        <Modal.Title>{t('modalAddChannel.addChannel')}</Modal.Title>
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
            <Form.Label visuallyHidden>
              {t('modalAddChannel.labelChannelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.body}
            </Form.Control.Feedback>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('reject')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
              >
                {t('send')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
