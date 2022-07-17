import './App.css';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchInput from "./components/SearchInput";
import {getVideos} from "./actions/videos";
import VideoItem from "./components/VideoItem";

const App = () => {
    const dispatch = useDispatch()
    const videoItems = useSelector(state => state.videos.items)
    const isFetching = useSelector(state => state.videos.isFetching)
    const isFetchError = useSelector(state => state.videos.isFetchError)

    function searchHandler(searchValue) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAa')
        console.log(searchValue)
        dispatch(getVideos(searchValue, 1, 10))

    }



    return (
        <div className="App">
          <header className="App-header">
              AAAAAAAAAAAAAAAAAAAAAAAAAAa
          </header>
        <SearchInput
            placeholder="Search"
            onSearch={searchHandler}
        />
        {
            isFetching === false
                ?
                videoItems.map(videoItem => <VideoItem videoItem={videoItem}/>)
                :
                <div className="fetching">

                </div>
        }
        </div>
      );
}

export default App;
