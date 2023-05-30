import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import FormMessage from './FormMessage';
import Message from './Message';
import { selectors as messagesSelectors } from '../../slices/messageSlice';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const ChatBox = () => {
  const currentChannel = useSelector(channelsSelectors.selectCurrentChannel);
  console.log('currentChannel', currentChannel);
  const messagesForCurrentChannel = useSelector(
    messagesSelectors.selectMessagesById,
  );
  console.log('messagesForCurrentChannel', messagesForCurrentChannel);
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel.name}</b>
          </p>
          <span className="text-muted">
            {messagesForCurrentChannel.length} Сообщений
          </span>
        </div>
        <div className="chat-messages overflow-auto px-5">
          {messagesForCurrentChannel.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <FormMessage />
      </div>
    </Col>
  );
};

export default ChatBox;

// todo:
//  -не понимаю как убрать костыль с тем когда нет свойства, почему так вообще просиходит?
//  -первый рендер у нас пустой стор и он не может прочитать свойства.
