import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';

import fetchDataThunk from '../../slices/thunks';
import ChannelBox from './ChannelBox';
import ChatBox from './ChatBox';
import { useSocket } from '../../hooks';
import { selectors as modalsSelectors } from '../../slices/modalSlice';
import getModalComponent from '../Modals';

const statusList = {
  notLoaded: 'notLoaded',
  loaded: 'loaded',
  loading: 'loading',
  errorLoad: 'errorLoad',
};

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center">
    <h2 className="me-2">Loading...</h2>
    <Spinner variant="primary" animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

const ChatError = () => {};

const Chat = () => {
  const loadingStatus = useSelector(
    (state) => state.channelsInfo.statusLoading,
  );

  switch (loadingStatus) {
    case statusList.loaded:
      return (
        <>
          <ChannelBox />
          <ChatBox />
        </>
      );
    case statusList.errorLoad:
      return <ChatError />;

    default:
      return <LoadingSpinner />;
  }
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const typeModal = useSelector(modalsSelectors.selectTypeModal);
  console.log('modalType', typeModal);
  // const typeModule;

  useEffect(() => {
    dispatch(fetchDataThunk());
    socket.connectSocket();

    return () => socket.disconnectSocket();
  }, [dispatch, socket]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Chat />
      </Row>
      {getModalComponent(typeModal)}
    </Container>
  );
};

export default ChatPage;

//TODO:
// -написать код который должен делать запросы
// -если запрос не удачный что с этим делать?
// -воводить страницу с ошибкой, либо редиректить на другую?
