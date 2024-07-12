import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust this import path as needed

interface Bookmark {
  videoId: number;
  userId: number;
  time: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
}

const initialState: BookmarkState = {
  bookmarks: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<Bookmark>) => {
      const index = state.bookmarks.findIndex(bookmark => 
        bookmark.videoId === action.payload.videoId && bookmark.userId === action.payload.userId
      );
      if (index !== -1) {
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.push(action.payload);
      }
    },
  },
});

export const selectIsVideoBookmarked = (state: RootState, videoId: number, userId: number) => 
  state.bookmark.bookmarks.some(bookmark => bookmark.videoId === videoId && bookmark.userId === userId);

export const { toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;