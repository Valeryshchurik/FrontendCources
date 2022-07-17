const SET_VIDEOS = "SET_VIDEOS"
const ADD_VIDEOS = "ADD_VIDEOS"

const defaultState = {
    videos: [],
    isFetching: true,
    isFetchError: false
}


export default function videosReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_VIDEOS:
            return {
                ...state,
                videos: action.payload.videos,
                isFetching: false
            }
        case ADD_VIDEOS:
            return {
                ...state,
                videos: [...state.videos, ...state.payload],
                isFetching: false
            }
        default:
            return state
    }
}

export const setVideos = (videos) => ({type:SET_VIDEOS, payload:videos})
export const addVideos = (videos) => ({type:ADD_VIDEOS, payload:videos})
