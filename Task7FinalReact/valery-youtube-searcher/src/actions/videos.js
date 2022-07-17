import axios from 'axios'
import {setFetchError, setIsFetching, setVideos} from "../reducers/videosReducer";

const KEY = ''; // mention your youtube API key here

export const setVideosFromYoutube = (searchQuery = "", currentPage, perPage) => {
    const videos = getYoutubeVideo(searchQuery, currentPage, perPage)
    dispatch(setVideos(videos))
}

export const addVideosFromYoutube = (searchQuery = "", currentPage, perPage=10) => {
    const videos = getYoutubeVideo(searchQuery, currentPage, perPage)
    dispatch(addVideos(videos))
}

function getYoutubeVideo(searchString, currentPage, perPage){
    if (searchQuery === "") {
        return
    }
    return async (dispatch) => {
        try {
            dispatch(setIsFetching(true))
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?q=${searchString}&type=video&part=snippet&maxResults=${perPage}&key=${KEY}`
            )
            return response.data.items.map(video => parseVideo(video))
        } catch (e) {
            console.error(e)
            dispatch(setFetchError(true))
            dispatch(setIsFetching(false))
            setTimeout(()=> {
                dispatch(setFetchError(false))
            }, 2000)
        }
    }
}

function parseVideo(youtubeVideo){
    return {
        id: youtubeVideo.id.videoId,
        title: youtubeVideo.snippet.title,
        description: youtubeVideo.snippet.description,
        channelTitle: youtubeVideo.snippet.channelTitle,
        imageUrl: youtubeVideo.snippet.thumbnails.high.url,
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
