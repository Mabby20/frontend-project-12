import { createAsyncThunk } from '@reduxjs/toolkit';
import fetchAllData from '../chatApi/fetchData';

const fetchDataThunk = createAsyncThunk(
  'fetchInitialData',
  async (_, { rejectedWithValue }) => {
    try {
      const data = await fetchAllData();
      return data;
    } catch (err) {
      return rejectedWithValue(err.response.data);
    }
  },
);

export default fetchDataThunk;
