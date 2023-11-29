import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { askAIandFetchResponsesAPI } from '../../api';

export const askAIandFetchResponses = createAsyncThunk(
  'application/askAIandFetchResponses',
  async (message) => {
    return await askAIandFetchResponsesAPI(message);
  }
);

const initialState = {
  messagesList: [
    {
      aiMessage: 'Hello, this is me AI bot 🤖\n How can I help you?',
    },
  ],
  companyDetails: null,
  loading: false,
  error: '',
};

const chatSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      const newMessage = {
        userMessage: action.payload,
      };
      state.messagesList = [...state.messagesList, newMessage];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAIandFetchResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askAIandFetchResponses.fulfilled, (state, action) => {
        const newResponse = {
          aiMessage: action.payload.message,
        };
        state.loading = false;
        state.messagesList = [...state.messagesList, newResponse];
      })
      .addCase(askAIandFetchResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { addUserMessage } = chatSlice.actions;

export default chatSlice.reducer;
