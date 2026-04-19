import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signupStep: number;
  tempUser: any;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
  signupStep: 1,
  tempUser: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    loginRequest: (s, _a: PayloadAction<{ email: string; password: string }>) => {
      s.loading = true;
      s.error = null;
    },
    loginSuccess: (s, a: PayloadAction<User>) => {
      s.loading = false;
      s.user = a.payload;
      localStorage.setItem("user", JSON.stringify(a.payload));
    },
    loginFailure: (s, a: PayloadAction<string>) => {
      s.loading = false;
      s.error = a.payload;
    },

    // SIGNUP FLOW
    signupNextStep: (s, a: PayloadAction<any>) => {
      s.tempUser = { ...s.tempUser, ...a.payload };
      s.signupStep += 1;
    },

    verifyOtpRequest: (s, _a: PayloadAction<{ otp: string }>) => {
      s.loading = true;
    },
    verifyOtpSuccess: (s) => {
      s.loading = false;
      s.signupStep = 3;
    },
    verifyOtpFailure: (s) => {
      s.loading = false;
      s.error = "Invalid OTP";
    },

    completeSignup: (s) => {
      localStorage.setItem("user", JSON.stringify(s.tempUser));
      s.signupStep = 4;
    },

    logout: (s) => {
      s.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupNextStep,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  completeSignup,
  logout,
} = authSlice.actions;

export default authSlice.reducer;