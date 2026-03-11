import { avexSlice } from "./AvexSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        avex: avexSlice.reducer,
    },
});