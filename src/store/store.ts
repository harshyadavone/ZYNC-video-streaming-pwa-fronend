import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./features/userSlice";
import subscriptionReducer from "./features/subscriptionSlice";
import likeReducer from "./features/likeSlice";
import dislikeReducer from "./features/dislikesSlice";
import bookmarkReducer from "./features/bookmarkSlice";

// Define the root state type
export interface RootState {
  user: ReturnType<typeof userReducer>;
  subscription: ReturnType<typeof subscriptionReducer>;
  like: ReturnType<typeof likeReducer>;
  dislike: ReturnType<typeof dislikeReducer>;
  bookmark: ReturnType<typeof bookmarkReducer>;
}

// Combine the reducers
const rootReducer = combineReducers({
  user: userReducer,
  subscription: subscriptionReducer,
  like: likeReducer,
  dislike: dislikeReducer,
  bookmark: bookmarkReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "subscription", "like", "dislike", "bookmark"], // Persist these reducers
};

// Create the persisted reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
