import { Button, ButtonGroup, Dropdown, Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as modalsActions } from '../../slices/modalSlice';

const Channel = ({ isActive, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isRemovable = channel.removable;
  const btnVariant = isActive ? 'secondary' : null;

  const handleDeleteModalClick = () => {
    dispatch(
      modalsActions.open({
        type: 'removing',
        targetId: channel.id,
      }),
    );
  };

  const handleRenameModalClick = () => {
    dispatch(
      modalsActions.open({
        type: 'renaming',
        targetId: channel.id,
      }),
    );
  };

  const handleChatSelect = () => {
    dispatch(channelsActions.changeCurrentChannelId({ id: channel.id }));
  };

  return (
    <Nav.Item className="w-100">
      {isRemovable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            onClick={handleChatSelect}
            className="w-100 rounded-0 text-start"
            variant={btnVariant}
          >
            <span>#</span> {channel.name}
          </Button>

          <Dropdown.Toggle
            split
            variant={btnVariant}
            className="flex-grow-0"
            id="dropdown-split-basic"
          />

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleDeleteModalClick}>
              {t('remove')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRenameModalClick}>
              {t('rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          onClick={handleChatSelect}
          className="w-100 rounded-0 text-start"
          variant={btnVariant}
        >
          <span>#</span> {channel.name}
        </Button>
      )}
    </Nav.Item>
  );
};

export default Channel;
