import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust this import path as needed

interface Like {
  videoId: number;
  userId: number;
}

interface LikeState {
  likes: Like[];
}

const initialState: LikeState = {
  likes: [],
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<Like>) => {
      const index = state.likes.findIndex(like => 
        like.videoId === action.payload.videoId && like.userId === action.payload.userId
      );
      if (index !== -1) {
        state.likes.splice(index, 1);
      } else {
        state.likes.push(action.payload);
      }
    },
  },
});

export const selectIsVideoLiked = (state: RootState, videoId: number, userId: number) => 
  state.like.likes.some(like => like.videoId === videoId && like.userId === userId);

export const { toggleLike } = likeSlice.actions;
export default likeSlice.reducer;