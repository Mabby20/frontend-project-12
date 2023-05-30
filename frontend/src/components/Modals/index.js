import Add from './Add';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const getModal = (modalType) => modals[modalType];

const getModalComponent = (modalType) => {
  console.log(modalType);
  if (modalType === null) {
    return null;
  }

  const Component = getModal(modalType);
  console.log('Component', Component);

  return <Component />;
};

export default getModalComponent;
