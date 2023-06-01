import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const Rename = () => {
  const input = useRef(null);
  const { t } = useTranslation();
  const socket = useSocket();
  const dispatch = useDispatch();
  const allChannelNames = useSelector(channelsSelectors.selectAllChannelNames);
  const { isOpened, targetId } = useSelector((state) => state.modals);
  const channelById = useSelector((state) =>
    channelsSelectors.selectChannelById(state, targetId),
  );
  const channelNameById = channelById.name;

  useEffect(() => {
    input.current.select();
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
      body: channelNameById,
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ body }) => {
      try {
        await socket.renameChannel({
          id: targetId,
          name: body,
        });
        dispatch(modalsActions.close());
        toast.success(t('toastify.successRenameChannel'));
      } catch (err) {
        toast.error(t('toastify.reject'));
        // если ошибка тоже выводить в сплывающие
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
        <Modal.Title>{t('modalRenameChannel.header')}</Modal.Title>
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
            <Form.Label visuallyHidden>
              {t('modalRenameChannel.labelChatName')}
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

export default Rename;
