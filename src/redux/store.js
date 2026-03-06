import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { api } from "./service/api";
import gameReducer from "./slice/gameSlice";
import { fetchMatch } from './service/fetchMatch'
import sportsStateSliceReducer from "./slice/sportsState.slice"
import betProfitsReducer from "./slice/betProfits.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    [api.reducerPath]: api.reducer,
    [fetchMatch.reducerPath]: fetchMatch.reducer,
    sportsState: sportsStateSliceReducer,
    betProfits: betProfitsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(fetchMatch.middleware),
});
