import { createSlice } from "@reduxjs/toolkit";
import { HOODIES , JEANS , SNEAKERS , FEATURED_PRODUCTS , ALL_PRODUCTS} from "./data";

const initialState = {
    // data
    hoodies: HOODIES,
    jeans: JEANS,
    sneakers: SNEAKERS,
    featuredProducts: FEATURED_PRODUCTS,
    allProducts: ALL_PRODUCTS,
    // UI state (e.g. filters, sort order) can be added here as needed

};

export const avexSlice = createSlice({
    name: "avex",
    initialState,
    reducers: {
        // Reducers for UI state (e.g. setting filters, sort order) can be added here
    },
});