/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  typeModal: null,
  isOpened: false,
  targetId: null,
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    open: (state, { payload }) => {
      console.log('payload in modalsSlice', payload);
      state.typeModal = payload.type;
      state.isOpened = true;
      state.targetId = payload.targetId;
    },
    close: (state) => {
      state.typeModal = null;
      state.isOpened = false;
      state.targetId = null;
    },
  },
});
const { actions } = modalSlice;

const selectors = {
  selectTypeModal: (state) => state.modals.typeModal,
};

export { actions, selectors };
export default modalSlice.reducer;
