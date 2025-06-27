// src/redux/purchase/purchaseThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/purchase";

const getError = (err) => err.response?.data?.error || err.message;

// ➕ Create purchase (stock is auto-updated by backend)
export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📋 Get all purchases
export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🆔 Get single purchase by ID
export const fetchPurchaseById = createAsyncThunk(
  "purchase/fetchPurchaseById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🔧 Update purchase
export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🗑️ Delete purchase
export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🔢 Get next entry number
export const fetchNextEntryNumber = createAsyncThunk(
  "purchase/fetchNextEntryNumber",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/next-entry-number`);
      return res.data.nextEntryNumber;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);
