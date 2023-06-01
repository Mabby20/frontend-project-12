import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import FormMessage from './FormMessage';
import Message from './Message';
import { selectors as messagesSelectors } from '../../slices/messageSlice';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const ChatBox = () => {
  const { t } = useTranslation();
  const currentChannel = useSelector(channelsSelectors.selectCurrentChannel);
  const channelName = filter.clean(currentChannel.name);
  const messagesForCurrentChannel = useSelector(
    messagesSelectors.selectMessagesById,
  );
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {channelName}</b>
          </p>
          <span className="text-muted">
            {t('message', { count: messagesForCurrentChannel.length })}
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
