import { useFilter } from '../../hooks';

const Message = ({ message }) => {
  const filterBadWord = useFilter();
  return (
    <div className="text-break mb-2">
      <b>{message.user}</b>
      {': '}
      {filterBadWord(message.body)}
    </div>
  );
};

export default Message;
