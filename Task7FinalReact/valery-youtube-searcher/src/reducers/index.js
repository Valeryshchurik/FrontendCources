import { configureStore } from '@reduxjs/toolkit';
import videosReducer from './videosReducer';

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
    reducer: {
        videos: videosReducer,
    },
});
