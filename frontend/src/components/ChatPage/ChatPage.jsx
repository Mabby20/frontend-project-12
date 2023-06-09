import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Container, Image, Row, Spinner,
} from 'react-bootstrap';
import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import fetchDataThunk from '../../slices/thunks';
import ChannelBox from './ChannelBox';
import ChatBox from './ChatBox';
import useAuth, { useSocket } from '../../hooks';
import { selectors as modalsSelectors } from '../../slices/modalSlice';
import getModalComponent from '../Modals';
import CommonError from '../../assets/commonError.png';
import Loading from '../../assets/loading.png';
import { apiRoutes } from '../../routes';

const statusList = {
  loaded: 'loaded',
  loading: 'loading',
  errorLoad: 'errorLoad',
};

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <div className="m-auto w-auto text-center">
      <Image width={200} height={200} alt="Spinner" src={Loading} />
      <h2 className="me-2">{t('loading')}</h2>
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  );
};

const ChatError = () => {
  const {
    errCode,
    message,
  } = useSelector((state) => state.channelsInfo.error);
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const { t } = useTranslation();
  const authErrHandler = () => {
    navigate(apiRoutes.loginPath);
    logOut();
  };
  const otherErrHandler = () => {
    navigate(0);
  };

  return (
    <div className="m-auto w-auto text-center">
      <Image width={200} height={200} alt="CommonError" src={CommonError} />
      <h3>{t('errorHeader')}</h3>
      {' '}
      <p>{message}</p>
      <Button onClick={() => {
        if (errCode === 401) {
          authErrHandler();
        } else {
          otherErrHandler();
        }
      }}
      >
        {errCode === 401 ? t('authErrorBtn') : t('update')}
      </Button>
    </div>
  );
};

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
  const { getAuthHeader } = useAuth();
  const authHeaders = useMemo(() => ({ headers: getAuthHeader() }), [getAuthHeader]);
  useEffect(() => {
    dispatch(fetchDataThunk(authHeaders));
    socket.connectSocket();

    return () => socket.disconnectSocket();
  }, [dispatch, socket, authHeaders]);

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
