// src/redux/invoice/invoiceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createInvoice,
  fetchInvoices,
  fetchInvoiceById,
  deleteInvoice,
} from "./invoiceThunks";

const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    clearInvoice(state) {
      state.currentInvoice = null;
    },
    clearInvoiceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ➕ Create
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch all
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Delete
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (inv) => inv._id !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoice, clearInvoiceError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
