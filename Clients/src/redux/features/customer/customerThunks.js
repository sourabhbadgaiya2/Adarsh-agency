// src/redux/customer/customerThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/customer";

// Utility to extract error message
const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error.message;
};

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch a customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customer/fetchCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a new customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update a customer
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete a customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
