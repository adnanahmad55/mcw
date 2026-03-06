import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gameTab: '4',
  initiateApiCall: false,
};

const sportsStateSlice = createSlice({
  name: "sportsState",
  initialState,
  reducers: {
    setGameTab: (state, action) => {
      state.gameTab = action.payload; 
    },
    setInitiateApiCall: (state, action) => {
      state.initiateApiCall = action.payload;
    },
  }
});

export const { setGameTab, setInitiateApiCall } = sportsStateSlice.actions;
export default sportsStateSlice.reducer;
