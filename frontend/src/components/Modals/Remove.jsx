import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';

const Remove = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = useSocket();

  const { isOpened, targetId } = useSelector((state) => state.modals);

  const handleClose = () => {
    dispatch(modalsActions.close());
  };

  const handleDeleteClick = async () => {
    try {
      const response = await socket.removeChannel(targetId);
      console.log('response', response);
      dispatch(modalsActions.close());
      // выводим в тоаст
    } catch (err) {
      // выводим ошибку в тоаст и запихиыаем в статистику
      console.log(err);
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
          <Button variant="danger" onClick={handleDeleteClick}>
            {t('remove')}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
