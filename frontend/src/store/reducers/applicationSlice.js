import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getBestCompaniesListAPI,
  getBestPlayerDetailsAPI,
  getBestPlayersListAPI,
  getCompanyDetailsAPI,
  getGameDetailsAPI,
  getVideoGamesListAPI,
} from '../../api';
import { parsedSearchParams } from '../../helper/parsedSearchParams';

export const fetchVideoGamesList = createAsyncThunk(
  'application/fetchVideoGamesList',
  async (searchTerm) => {
    const { currentGamesPage, paramValue } = searchTerm;
    return await getVideoGamesListAPI(paramValue, currentGamesPage);
  }
);

export const fetchBestPlayersList = createAsyncThunk(
  'application/fetchBestPlayersList',
  async (searchTerm) => {
    const { paramValue } = searchTerm;
    return await getBestPlayersListAPI(paramValue);
  }
);

export const fetchGameDetailsById = createAsyncThunk(
  'application/fetchGameDetailsById',
  async (id) => {
    return await getGameDetailsAPI(id);
  }
);

export const fetchBestPlayerDetailsByGameId = createAsyncThunk(
  'application/fetchBestPlayerDetailsByGameId',
  async (id) => {
    return await getBestPlayerDetailsAPI(id);
  }
);

export const fetchBestCompaniesList = createAsyncThunk(
  'application/fetchBestCompaniesList',
  async () => {
    return await getBestCompaniesListAPI();
  }
);

export const fetchCompanyDetailsById = createAsyncThunk(
  'application/fetchCompanyDetailsById',
  async (id) => {
    return await getCompanyDetailsAPI(id);
  }
);

const initialState = {
  gamesList: [],
  playersList: [],
  companiesList: [],
  gameDetails: null,
  bestPlayerDetails: null,
  companyDetails: null,
  currentGamesPage: 1,
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
    loadMoreGames: (state) => {
      state.currentGamesPage = state.currentGamesPage + 1;
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
        state.error = true;
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
        state.error = true;
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
        state.error = true;
      })
      .addCase(fetchBestPlayerDetailsByGameId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestPlayerDetailsByGameId.fulfilled, (state, action) => {
        state.loading = false;
        state.bestPlayerDetails = action.payload;
      })
      .addCase(fetchBestPlayerDetailsByGameId.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchBestCompaniesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestCompaniesList.fulfilled, (state, action) => {
        state.loading = false;
        state.companiesList = action.payload;
      })
      .addCase(fetchBestCompaniesList.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCompanyDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
      })
      .addCase(fetchCompanyDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { setSearchParam, loadMoreGames } = applicationSlice.actions;

export default applicationSlice.reducer;
