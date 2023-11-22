import { configureStore } from '@reduxjs/toolkit';
import applicationSlice from './reducers/applicationSlice';

const store = configureStore({
  reducer: {
    application: applicationSlice, // Other reducers here
  },
});

export default store;
