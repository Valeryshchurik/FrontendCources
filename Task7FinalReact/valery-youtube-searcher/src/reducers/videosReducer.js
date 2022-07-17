const SET_VIDEOS = "SET_VIDEOS"
const ADD_VIDEOS = "ADD_VIDEOS"
const SET_IS_FETCHING = "SET_IS_FETCHING"
const SET_FETCH_ERROR = "SET_FETCH_ERROR"


const defaultState = {
    items: [],
    isFetching: true,
    isFetchError: false
}


export default function videosReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_VIDEOS:
            return {
                ...state,
                items: action.payload.items,
                isFetching: false
            }
        case ADD_VIDEOS:
            return {
                ...state,
                items: [...state.items, ...state.payload],
                isFetching: false
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.payload
            }
        case SET_FETCH_ERROR:
            return {
                ...state,
                isFetchError: action.payload
            }
        default:
            return state
    }
}

export const setVideos = (items) => ({type:SET_VIDEOS, payload:items})
export const setIsFetching = (bool) => ({type:SET_IS_FETCHING, payload:bool})
export const setFetchError = (bool) => ({type:SET_FETCH_ERROR, payload:bool})
