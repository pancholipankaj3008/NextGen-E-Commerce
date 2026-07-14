import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateReturnAPI, GetMyReturnsAPI, GetReturnsAPI, UpdateReturnAPI } from "./returnAPI";
const reject = (error, thunkAPI) => thunkAPI.rejectWithValue(error.response?.data || { message: "Unable to process return request" });
export const CreateReturn = createAsyncThunk("returns/create", async (data, api) => { try { return (await CreateReturnAPI(data)).data; } catch (e) { return reject(e, api); } });
export const GetMyReturns = createAsyncThunk("returns/mine", async (_, api) => { try { return (await GetMyReturnsAPI()).data; } catch (e) { return reject(e, api); } });
export const GetReturns = createAsyncThunk("returns/all", async (_, api) => { try { return (await GetReturnsAPI()).data; } catch (e) { return reject(e, api); } });
export const UpdateReturn = createAsyncThunk("returns/update", async (data, api) => { try { return (await UpdateReturnAPI(data)).data; } catch (e) { return reject(e, api); } });
