
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCategory: "Hot Games",
    provider: null,
    gameTag: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setProvider: (state, action) => {
            state.provider = action.payload;
        },
        setGameTag: (state, action) => {
            state.gameTag = action.payload;
        },
        resetFilters: (state) => {
            state.selectedCategory = null;
            state.provider = null;
            state.gameTag = null;
        },
    },
});

export const { setCategory, setProvider, setGameTag, resetFilters } =
    gameSlice.actions;
export default gameSlice.reducer;
