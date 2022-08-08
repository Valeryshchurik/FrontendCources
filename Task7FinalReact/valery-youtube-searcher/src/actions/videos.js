import axios from 'axios';
import {
    addVideos, setFetchError, setIsFetching, setNextPageToken, setVideos,
} from 'reducers/videosReducer';

const KEY = 'AIzaSyB_PrLVSwyYefFqACMi8nzHEqA_92lKrgw'; // mention your youtube API key here

export const setVideosFromYoutube = (searchQuery = '', perPage) => async (dispatch) => {
    const videos = await getYoutubeVideo(dispatch, searchQuery, '', perPage);

    dispatch(setVideos(videos));
};

export const addVideosFromYoutube = (searchQuery = '', pageToken, perPage = 3) => async (dispatch) => {
    const videos = await getYoutubeVideo(dispatch, searchQuery, pageToken, perPage);
    dispatch(addVideos(videos));
    dispatch(setIsFetching(false));
};

async function getYoutubeVideo(dispatch, searchString, pageToken, perPage) {
    try {
        dispatch(setIsFetching(true));
        let queryUrl = `https://www.googleapis.com/youtube/v3/search?q=${searchString}&type=video&part=snippet&maxResults=${perPage}&key=${KEY}`;
        if (pageToken) {
            queryUrl += `&pageToken=${pageToken}`;
        }
        const response = await axios.get(queryUrl);
        const parsedVideo = response.data.items.map((video) => parseVideo(video));
        dispatch(setNextPageToken(response.data.nextPageToken));
        dispatch(setFetchError(false));
        return parsedVideo;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        dispatch(setFetchError(true));
        dispatch(setIsFetching(false));
        return [];
    }
}

function parseVideo(youtubeVideo) {
    return {
        id: youtubeVideo.id.videoId,
        title: youtubeVideo.snippet.title,
        description: youtubeVideo.snippet.description,
        channelTitle: youtubeVideo.snippet.channelTitle,
        imageUrl: youtubeVideo.snippet.thumbnails.high.url,
    };
}

export const getCurrentRepo = async (username, repoName, setRepo) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}`);
    setRepo(response.data);
};

export const getCotributors = async (username, repoName, setContributors) => {
    const response = await axios.get(`https://api.github.com/videos/${username}/${repoName}/contributors?page=1&per_page=10`);
    setContributors(response.data);
};
