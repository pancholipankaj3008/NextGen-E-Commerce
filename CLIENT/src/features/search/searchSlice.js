import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";
import { normalizeProduct } from "../../utils/product";

export const searchProducts = createAsyncThunk("search/products", async (query, thunkAPI) => {
  try {
    const res = await API.get("/product/all-products", { params: { search: query, limit: 6 } });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Search failed" });
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState: { suggestions: [], recent: JSON.parse(localStorage.getItem("ng_recent_searches") || "[]"), loading: false },
  reducers: {
    rememberSearch: (state, action) => {
      state.recent = [action.payload, ...state.recent.filter((item) => item !== action.payload)].slice(0, 6);
      localStorage.setItem("ng_recent_searches", JSON.stringify(state.recent));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = (action.payload.products || action.payload.items || []).map(normalizeProduct);
      })
      .addCase(searchProducts.rejected, (state) => {
        state.loading = false;
        state.suggestions = [];
      });
  },
});

export const { rememberSearch } = searchSlice.actions;
export default searchSlice.reducer;
