import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRollbar } from '@rollbar/react';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';

const Remove = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const socket = useSocket();
  const rollbar = useRollbar();
  const { t } = useTranslation();

  const { isOpened, targetId } = useSelector((state) => state.modals);

  const handleClose = () => {
    dispatch(modalsActions.close());
  };

  const handleDeleteClick = async () => {
    try {
      setIsSubmitting(true);
      await socket.removeChannel(targetId);
      dispatch(modalsActions.close());
      toast.success(t('toastify.successRemoveChannel'));
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      toast.error(t('toastify.reject'));
      rollbar.error('removeChannel', err);
      console.error(err);
    }
  };

  return (
    <Modal show={isOpened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modalRemoveChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modalRemoveChannel.body')}</p>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('reject')}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            disabled={isSubmitting}
          >
            {t('remove')}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
