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

    const sendMessage = (message) => {
      socket.timeout(3000).emit('newMessage', message, (err, data) => {
        console.log('err on newMessage', err, 'message on newMessage', data);
      });
    };
    const addNewChannel = (channel) => {
      socket.timeout(3000).emit('newChannel', channel, (err, data) => {
        console.log('err on newChannel', err, 'message on newChannel', data);
      });
    };
    const removeChannel = (targetId) => {
      socket
        .timeout(3000)
        .emit('removeChannel', { id: targetId }, (err, data) => {
          console.log(
            'err on removeChannel',
            err,
            'message on removeChannel',
            data,
          );
        });
    };
    const renameChannel = (updateChannelInfo) => {
      socket
        .timeout(3000)
        .emit('renameChannel', updateChannelInfo, (err, data) => {
          console.log(
            'err on renameChannel',
            err,
            'message on renameChannel',
            data,
          );
        });
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
