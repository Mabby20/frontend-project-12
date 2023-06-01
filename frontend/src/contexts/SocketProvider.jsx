import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { actions as messagesActions } from '../slices/messageSlice';
import { actions as channelsActions } from '../slices/channelsSlice';
import { SocketContext } from './index';

const SocketProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const memoContext = useMemo(() => {
    const connectSocket = () => {
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
    };

    const disconnectSocket = () => {
      socket.disconnect();
    };

    const sendMessage = async (message) => {
      await socket.timeout(3000).emitWithAck('newMessage', message);
    };
    const addNewChannel = async (channel) => {
      await socket.timeout(3000).emitWithAck('newChannel', channel);
    };

    const removeChannel = async (targetId) => {
      await socket.timeout(3000).emitWithAck('removeChannel', { id: targetId });
    };
    const renameChannel = async (updateChannelInfo) => {
      await socket
        .timeout(3000)
        .emitWithAck('renameChannel', updateChannelInfo);
    };

    return {
      connectSocket,
      sendMessage,
      addNewChannel,
      removeChannel,
      renameChannel,
      disconnectSocket,
    };
  }, [dispatch, socket]);

  return (
    <SocketContext.Provider value={memoContext}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
