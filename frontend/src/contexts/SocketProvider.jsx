import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { actions as messagesActions } from '../slices/messageSlice';
import { actions as channelsActions } from '../slices/channelsSlice';
import { SocketContext } from './index';

const SocketProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const connectSocket = useCallback(() => {
    socket.connect();

    socket.on('newMessage', (message) => {
      console.log('new message', message);
      dispatch(messagesActions.addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      console.log('new channel', channel);
      dispatch(channelsActions.addChanel(channel));
      dispatch(channelsActions.changeCurrentChannelId({ id: channel.id }));
    });

    socket.on('removeChannel', ({ id }) => {
      console.log('id by remove channel', id);
      dispatch(channelsActions.removeChannel(id));
    });

    socket.on('renameChannel', (channel) => {
      console.log('rename channel', channel);
      dispatch(
        channelsActions.renameChannel({
          id: channel.id,
          changes: { name: channel.name },
        }),
      );
    });
  }, [dispatch, socket]);

  const disconnectSocket = useCallback(() => {
    socket.disconnect();
  }, [socket]);

  const sendMessage = useCallback(
    async (message) => {
      await socket.timeout(3000).emitWithAck('newMessage', message);
    },
    [socket],
  );

  const addNewChannel = useCallback(
    async (channel) => {
      await socket.timeout(3000).emitWithAck('newChannel', channel);
    },
    [socket],
  );

  const removeChannel = useCallback(
    async (targetId) => {
      await socket.timeout(3000).emitWithAck('removeChannel', { id: targetId });
    },
    [socket],
  );

  const renameChannel = useCallback(
    async (updateChannelInfo) => {
      await socket
        .timeout(3000)
        .emitWithAck('renameChannel', updateChannelInfo);
    },
    [socket],
  );

  const memoContext = useMemo(
    () => ({
      connectSocket,
      sendMessage,
      addNewChannel,
      removeChannel,
      renameChannel,
      disconnectSocket,
    }),
    [
      addNewChannel,
      connectSocket,
      disconnectSocket,
      removeChannel,
      renameChannel,
      sendMessage,
    ],
  );

  return (
    <SocketContext.Provider value={memoContext}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
