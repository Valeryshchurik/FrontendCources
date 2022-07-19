const SET_VIDEOS = "SET_VIDEOS"
const ADD_VIDEOS = "ADD_VIDEOS"
const SET_IS_FETCHING = "SET_IS_FETCHING"
const SET_FETCH_ERROR = "SET_FETCH_ERROR"
const SET_NEXT_PAGE_TOKEN = "SET_NEXT_PAGE_TOKEN"

const defaultState = {
    items: [],
    isFetching: false,
    isFetchError: false,
    nextPageToken: ''
}


export default function videosReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_VIDEOS:
            return {
                ...state,

                items: action.payload,
                isFetching: false
            }
        case ADD_VIDEOS:
            return {
                ...state,
                items: [...state.items, ...action.payload],
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
        case SET_NEXT_PAGE_TOKEN:
            return {
                ...state,
                nextPageToken: action.payload
            }
        default:
            return state
    }
}

export const setVideos = (items) => ({type:SET_VIDEOS, payload:items})
export const addVideos = (items) => ({type:ADD_VIDEOS, payload:items})
export const setIsFetching = (bool) => ({type:SET_IS_FETCHING, payload:bool})
export const setFetchError = (bool) => ({type:SET_FETCH_ERROR, payload:bool})
export const setNextPageToken = (bool) => ({type:SET_NEXT_PAGE_TOKEN, payload:bool})
