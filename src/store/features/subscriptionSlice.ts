import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Subscription {
  id: number;
  channelId: number;
  status: "ACTIVE" | "INACTIVE";
  channelName: string;
  channelProfileImage: string;
  subscriberCount: number;
}

interface SubscriptionState {
  subscriptions: Subscription[];
}

const initialState: SubscriptionState = {
  subscriptions: [],
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      const index = state.subscriptions.findIndex(sub => sub.channelId === action.payload.channelId);
      if (index !== -1) {
        state.subscriptions[index] = action.payload;
      } else {
        state.subscriptions.push(action.payload);
      }
    },
    removeSubscription: (state, action: PayloadAction<number>) => {
      state.subscriptions = state.subscriptions.filter(sub => sub.channelId !== action.payload);
    },
  },
});

export const { updateSubscription, removeSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;