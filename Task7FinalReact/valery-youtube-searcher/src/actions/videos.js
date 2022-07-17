import axios from 'axios'
import {setFetchError, setIsFetching, setVideos} from "../reducers/videosReducer";
const KEY = ''; // mention your youtube API key here

export const getVideos = (searchQuery = "stars:%3E1", currentPage, perPage) => {
    if (searchQuery === "") {
        return
    }
    return async (dispatch) => {
        try {
            dispatch(setIsFetching(true))
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${searchQuery}&part=snippet&maxResults=5&key=${KEY}`)
            dispatch(setVideos(response.data))
        } catch (e) {
            dispatch(setFetchError(true))
            dispatch(setIsFetching(false))
            setTimeout(()=> {
                dispatch(setFetchError(false))
            }, 2000)
        }

    }
}

export const getCurrentRepo = async (username, repoName, setRepo) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}`)
    setRepo(response.data)
}

export const getCotributors = async (username, repoName, setContributors) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}/contributors?page=1&per_page=10`)
    setContributors(response.data)
}
