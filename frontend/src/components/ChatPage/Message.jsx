const Message = ({ message }) => {
  return (
    <div className="text-break mb-2">
      <b>{message.user}</b>
      {': '}
      {message.body}
    </div>
  );
};

export default Message;
