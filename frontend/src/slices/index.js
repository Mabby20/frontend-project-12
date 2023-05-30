import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './channelsSlice';
import messageReducer from './messageSlice';
import modalsReducer from './modalSlice';

export default configureStore({
  reducer: {
    channelsInfo: channelReducer,
    messages: messageReducer,
    modals: modalsReducer,
  },
});
