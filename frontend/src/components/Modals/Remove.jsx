import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions } from '../../slices/modalSlice';
import { useSocket } from '../../hooks';

const Remove = () => {
  const dispatch = useDispatch();
  const socket = useSocket();

  const { isOpened, targetId } = useSelector((state) => state.modals);

  const handleClose = () => {
    dispatch(modalsActions.close());
  };

  const handleDeleteClick = async () => {
    try {
      const respose = await socket.removeChannel(targetId);
      console.log('respose by delete channel', respose);
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
        <Modal.Title>Удалить канал?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="danger" onClick={handleDeleteClick}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
