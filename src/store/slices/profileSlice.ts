import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Profile, Settings } from "../../features/profile/types";

interface ProfileState {
  profile: Profile;
  settings: Settings;
}

const initialState: ProfileState = {
  profile: {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    image: "",
  },
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    alerts: true,
    theme: "light",
    language: "en",
    timezone: "Asia/Kolkata",
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<Profile>>) {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateSettings(state, action: PayloadAction<Partial<Settings>>) {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { updateProfile, updateSettings } = profileSlice.actions;
export default profileSlice.reducer;