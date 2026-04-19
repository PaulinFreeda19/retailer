import { takeLatest, put, delay } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
} from "../slices/authSlice";

function* handleLogin(action: any): any {
  try {
    yield delay(1000);

    const { email, password } = action.payload;

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      yield put(loginSuccess(storedUser));
    } else {
      yield put(loginFailure("Invalid credentials"));
    }
  } catch {
    yield put(loginFailure("Something went wrong"));
  }
}

function* handleOtp(action: any): any {
  yield delay(800);

  if (action.payload.otp === "123456") {
    yield put(verifyOtpSuccess());
  } else {
    yield put(verifyOtpFailure());
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(verifyOtpRequest.type, handleOtp);
}