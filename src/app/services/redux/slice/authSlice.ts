import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authData: JSON.parse(localStorage.getItem("authData") || "null"),
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const authSlice = createSlice({
  name: "authData",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.authData = action.payload.authData;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;

      localStorage.setItem("authData", JSON.stringify(action.payload.authData));
      localStorage.setItem("accessToken", action.payload.accessToken);

      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },

    clearAuthData: (state) => {
      state.authData = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("authData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
