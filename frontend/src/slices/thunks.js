import { createAsyncThunk } from '@reduxjs/toolkit';
import fetchAllData from '../chatApi/fetchData';

const fetchDataThunk = createAsyncThunk(
  'fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllData();
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  },
);

export default fetchDataThunk;
