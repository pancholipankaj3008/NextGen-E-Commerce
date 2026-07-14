import { createSlice } from "@reduxjs/toolkit";
import { CreateReturn, GetMyReturns, GetReturns, UpdateReturn } from "./returnThunk";
const initialState = { mine: [], all: [], loading: false, actionLoading: false, error: null, message: "" };
const slice = createSlice({ name: "returns", initialState, reducers: { clearReturnMessage: (s) => { s.error = null; s.message = ""; } }, extraReducers: (b) => b
  .addCase(GetMyReturns.fulfilled, (s, a) => { s.loading = false; s.mine = a.payload.requests || []; })
  .addCase(GetReturns.fulfilled, (s, a) => { s.loading = false; s.all = a.payload.requests || []; })
  .addCase(CreateReturn.pending, (s) => { s.actionLoading = true; s.error = null; })
  .addCase(CreateReturn.fulfilled, (s, a) => { s.actionLoading = false; s.message = a.payload.message; s.mine.unshift(a.payload.request); })
  .addCase(UpdateReturn.fulfilled, (s, a) => { s.actionLoading = false; s.message = a.payload.message; s.all = s.all.map((r) => r._id === a.payload.request._id ? a.payload.request : r); })
  .addCase(UpdateReturn.pending, (s) => { s.actionLoading = true; })
  .addMatcher((a) => [GetMyReturns.pending.type, GetReturns.pending.type].includes(a.type), (s) => { s.loading = true; s.error = null; })
  .addMatcher((a) => [GetMyReturns.rejected.type, GetReturns.rejected.type, CreateReturn.rejected.type, UpdateReturn.rejected.type].includes(a.type), (s, a) => { s.loading = false; s.actionLoading = false; s.error = a.payload?.message; }) });
export const { clearReturnMessage } = slice.actions;
export default slice.reducer;
