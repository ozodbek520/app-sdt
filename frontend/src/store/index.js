import { configureStore } from '@reduxjs/toolkit';
import applicationSlice from './reducers/applicationSlice';
import chatSlice from './reducers/chatSlice';

const store = configureStore({
  reducer: {
    application: applicationSlice,
    chat: chatSlice,
  },
});

export default store;
