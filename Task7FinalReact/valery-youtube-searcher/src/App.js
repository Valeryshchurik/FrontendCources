import './App.css';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchInput from "./components/SearchInput/SearchInput";
import {setVideosFromYoutube} from "./actions/videos";
import VideoItem from "./components/VideoItem/VideoItem";

const App = () => {
    const dispatch = useDispatch()
    const videoItems = useSelector(state => state.videos.items)
    const isFetching = useSelector(state => state.videos.isFetching)
    const isFetchError = useSelector(state => state.videos.isFetchError)

    function searchHandler(searchValue) {
        dispatch(setVideosFromYoutube(searchValue, 1, 10))

    }



    return (
        <div className="App">
            <div className="Head">
              <h1>Youtube searcher</h1>
            </div>
            <div className="MainContainer">
                <SearchInput
                    className="Big"
                    placeholder="Search"
                    onSearch={searchHandler}
                />
                <div className="VideoContainer">
                {
                    isFetching === false
                        ?
                        videoItems.map(videoItem => <VideoItem videoItem={videoItem}/>)
                        :
                        <div className="fetching">

                        </div>
                }
                </div>
            </div>
        </div>
      );
}

export default App;
