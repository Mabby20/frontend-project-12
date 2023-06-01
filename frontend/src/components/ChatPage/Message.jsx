import filter from 'leo-profanity';

const Message = ({ message }) => {
  const messageText = filter.clean(message.body);
  return (
    <div className="text-break mb-2">
      <b>{message.user}</b>
      {': '}
      {messageText}
    </div>
  );
};

export default Message;
