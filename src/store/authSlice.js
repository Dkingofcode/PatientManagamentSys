// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};
// Async thunk for login
export const loginUser = createAsyncThunk("auth/login", async ({ identifier, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:8000/api/auth/login", {
            identifier, // Can be email, username, or user ID
            password,
        });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        clearError(state) {
            state.error = null;
        },
        setUserFromStorage(state) {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");
            if (token && user) {
                state.token = token;
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        })
            .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export const { logout, clearError, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
