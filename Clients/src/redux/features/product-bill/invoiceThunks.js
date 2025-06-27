// pro-billing
// src/redux/invoice/invoiceThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/pro-billing";

// Utility for error messaging
const getError = (err) =>
  err.response?.data?.error || err.response?.data?.message || err.message;

// ➕ Create an invoice
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, invoiceData);
      return res.data.invoice;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📥 Fetch all invoices
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🗑️ Delete an invoice
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📄 Fetch invoice by ID
export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);
