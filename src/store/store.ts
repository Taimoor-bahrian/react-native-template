import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import counterReducer from "./slices/counterSlice";

// Persist config
const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

// Combine reducers
const rootReducer = combineReducers({
    counter: counterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Redux Persist
        }),
});

// Create persistor
export const persistor = persistStore(store);