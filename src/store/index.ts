import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import deliveryReducer from "./slices/deliverySlice";
import profileReducer from "./slices/profileSlice";
import rootSaga from "./sagas/rootSaga";

const saga = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    delivery: deliveryReducer,
    profile: profileReducer,
  },
  middleware: (gDM) => gDM({ thunk: false }).concat(saga),
});

saga.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;