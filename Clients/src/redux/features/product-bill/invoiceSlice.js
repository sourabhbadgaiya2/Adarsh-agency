// src/redux/invoice/invoiceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createInvoice,
  fetchInvoices,
  fetchInvoiceById,
  deleteInvoice,
  fetchInvoicesByCustomer,
  fetchBalanceByCustomer,
} from "./invoiceThunks";

const initialState = {
  invoices: [],
  currentInvoice: null,
  invoicesByCustomer: [],
  balanceByCustomer: 0,
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

      // ✅ Invoices
      .addCase(fetchInvoicesByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByCustomer = action.payload;
      })
      .addCase(fetchInvoicesByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Balance
      .addCase(fetchBalanceByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceByCustomer = action.payload.balance; // ✅
      })
      .addCase(fetchBalanceByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
