import axios from 'axios'
import {setFetchError, setIsFetching, setVideos} from "../reducers/videosReducer";
const KEY = 'AIzaSyArwvzWg4eNstGvmXd4xB8p_Jmb2-dwG_o'; // mention your youtube API key here

export const getVideos = (searchQuery = "proffesional", currentPage, perPage) => {
    console.log(searchQuery)
    if (searchQuery === "") {
        return
    }
    return async (dispatch) => {
        try {
            dispatch(setIsFetching(true))
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${searchQuery}&type=video&part=snippet&maxResults=5&key=${KEY}`)
            const videos = response.data.items.map(video => parseVideo(video))
            dispatch(setVideos(videos))
            console.log(videos)
        } catch (e) {
            dispatch(setFetchError(true))
            dispatch(setIsFetching(false))
            setTimeout(()=> {
                dispatch(setFetchError(false))
            }, 2000)
        }

    }
}

function parseVideo(youtubeVideo){
    const parsedVideo = {
        id: youtubeVideo.id,
        title: youtubeVideo.snippet.title,
        channelTitle: youtubeVideo.snippet.channelTitle,
        imageUrl: youtubeVideo.snippet.thumbnails.url
    }
    return parsedVideo
}

export const getCurrentRepo = async (username, repoName, setRepo) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}`)
    setRepo(response.data)
}

export const getCotributors = async (username, repoName, setContributors) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}/contributors?page=1&per_page=10`)
    setContributors(response.data)
}
