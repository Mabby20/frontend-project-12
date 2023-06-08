import { createAsyncThunk } from '@reduxjs/toolkit';
import fetchAllData from '../chatApi/fetchData';

const fetchDataThunk = createAsyncThunk(
  'fetchInitialData',
  async (header, { rejectWithValue }) => {
    try {
      return await fetchAllData(header);
    } catch (err) {
      return rejectWithValue({ message: err.message, errCode: err.response.status });
    }
  },
);

export default fetchDataThunk;
