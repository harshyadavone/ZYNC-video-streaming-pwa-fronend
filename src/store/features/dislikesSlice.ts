import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust this import path as needed

interface Dislike {
  videoId: number;
  userId: number;
}

interface DislikeState {
  dislikes: Dislike[];
}

const initialState: DislikeState = {
  dislikes: [],
};

const dislikeSlice = createSlice({
  name: "dislike",
  initialState,
  reducers: {
    toggleDislike: (state, action: PayloadAction<Dislike>) => {
      const index = state.dislikes.findIndex(dislike => 
        dislike.videoId === action.payload.videoId && dislike.userId === action.payload.userId
      );
      if (index !== -1) {
        state.dislikes.splice(index, 1);
      } else {
        state.dislikes.push(action.payload);
      }
    },
  },
});

export const selectIsVideoDisliked = (state: RootState, videoId: number, userId: number) => 
  state.dislike.dislikes.some(dislike => dislike.videoId === videoId && dislike.userId === userId);

export const { toggleDislike } = dislikeSlice.actions;
export default dislikeSlice.reducer;