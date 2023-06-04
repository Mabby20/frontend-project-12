/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import fetchDataThunk from './thunks';

const statusList = {
  notLoaded: 'notLoaded',
  loaded: 'loaded',
  loading: 'loading',
  errorLoad: 'errorLoad',
};

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
  statusLoading: statusList.notLoaded,
  error: null,
});

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    addChanel: channelsAdapter.addOne,
    removeChannel: (state, { payload }) => {
      const channelIdForRemove = payload;
      const activeChannelId = state.currentChannelId;
      if (channelIdForRemove === activeChannelId) {
        state.currentChannelId = 1;
      }
      channelsAdapter.removeOne(state, channelIdForRemove);
    },
    renameChannel: channelsAdapter.updateOne,
    changeCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line functional/no-expression-statements
    builder
      .addCase(fetchDataThunk.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload.channels);
        state.currentChannelId = action.payload.currentChannelId;
        state.error = null;
        state.statusLoading = statusList.loaded;
      })
      .addCase(fetchDataThunk.pending, (state) => {
        state.error = null;
        state.statusLoading = statusList.loading;
      })
      .addCase(fetchDataThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.statusLoading = statusList.errorLoad;
      });
  },
});

const { actions } = channelsSlice;

const selectors = channelsAdapter.getSelectors((state) => state.channelsInfo);

const customSelectors = {
  selectAll: selectors.selectAll,
  selectChannelById: selectors.selectById,
  selectAllChannelNames: (state) => {
    const channels = selectors.selectAll(state);
    return channels.map(({ name }) => name);
  },
  selectCurrentChannelId: (state) => state.channelsInfo.currentChannelId,
  selectCurrentChannel: (state) => {
    const { currentChannelId } = state.channelsInfo;
    return selectors.selectById(state, currentChannelId);
  },
};
export { actions, customSelectors as selectors };
export default channelsSlice.reducer;
