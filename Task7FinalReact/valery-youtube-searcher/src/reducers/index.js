import { configureStore } from '@reduxjs/toolkit';
import videosReducer from './videosReducer';

export const store = configureStore({
    reducer: {
        videos: videosReducer,
    },
});
