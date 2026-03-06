// redux/slices/betProfitsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const betProfitsSlice = createSlice({
  name: 'betProfits',
  initialState: {
    profits: {},
    betMatchId: '',
    fetchBetApi: false,
    backBetProfit: '',
    layBetProfit: '',
    marketMatchId: '',
    betBackPlaceProfit: 0,
    betLayPlaceProfit: 0,
    drawBetProfit: '',
    betPlacePrice: '',
  },
  reducers: {
    setBetProfits(state, action) {
      state.profits = { ...state.profits, ...action.payload };
    },
    setBetMatchId(state, action) {
      state.betMatchId = action.payload;
    },
    setFetchBetApi(state, action) {
      state.fetchBetApi = action.payload;
    },
    setBackBetProfit(state, action) {
      state.backBetProfit = action.payload;
    },
    setLayBetProfit(state, action) {
      state.layBetProfit = action.payload;
    },
    setBetBackPlaceProfit(state, action) {
      state.layBetProfit = action.payload;
    },
    setBetLayPlaceProfit(state, action) {
      state.layBetProfit = action.payload;
    },
    setMarketMatchId(state, action) {
      state.marketMatchId = action.payload;
    },
    setBetPlacePrice(state, action) {
      state.betPlacePrice = action.payload;
    },
    clearBetProfits(state) {
      state.profits = {};
    },
  },
});

export const { setBetProfits, clearBetProfits, setBetMatchId, setFetchBetApi, setBackBetProfit, setLayBetProfit, setMarketMatchId, setBetBackPlaceProfit, setBetLayPlaceProfit, setBetPlacePrice } = betProfitsSlice.actions;
export default betProfitsSlice.reducer;
