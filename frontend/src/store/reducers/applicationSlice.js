import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBestPlayersListAPI, getGameDetailsAPI, getVideoGamesListAPI } from '../../api';
import { parsedSearchParams } from '../../helper/parsedSearchParams';

export const fetchVideoGamesList = createAsyncThunk(
  'application/fetchVideoGamesList',
  async (searchTerm) => {
    return await getVideoGamesListAPI(searchTerm);
  }
);

export const fetchBestPlayersList = createAsyncThunk(
  'application/fetchBestPlayersList',
  async (searchTerm) => {
    return await getBestPlayersListAPI(searchTerm);
  }
);

export const fetchGameDetailsById = createAsyncThunk(
  'application/fetchGameDetailsById',
  async (id) => {
    return await getGameDetailsAPI(id);
  }
);

const initialState = {
  gamesList: [],
  playersList: [],
  gameDetails: null,
  search: {
    game: parsedSearchParams('search_game'),
    player: parsedSearchParams('search_player'),
  },
  loading: false,
  error: '',
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setSearchParam: (state, action) => {
      const param = action.payload.param;
      state.search[param] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoGamesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoGamesList.fulfilled, (state, action) => {
        state.loading = false;
        state.gamesList = action.payload;
      })
      .addCase(fetchVideoGamesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBestPlayersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestPlayersList.fulfilled, (state, action) => {
        state.loading = false;
        state.playersList = action.payload;
      })
      .addCase(fetchBestPlayersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGameDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.gameDetails = action.payload;
      })
      .addCase(fetchGameDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchParam } = applicationSlice.actions;

export default applicationSlice.reducer;
