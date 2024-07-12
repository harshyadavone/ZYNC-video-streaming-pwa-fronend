import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface video {
  video: any;
}

const initialState: video = {
  video: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo(state, action: PayloadAction<any>) {
      state.video = action.payload;
    },
  },
});

export const { setVideo } = videoSlice.actions;
export default videoSlice.reducer;
