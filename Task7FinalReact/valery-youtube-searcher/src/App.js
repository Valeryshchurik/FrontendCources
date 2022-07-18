import './App.css';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchInput from "./components/SearchInput/SearchInput";
import {setVideosFromYoutube, addVideosFromYoutube} from "./actions/videos";
import Error from "./components/Error/Error";
import VideoContainer from "./components/VideoContainer/VideoContainer";

const App = () => {
    const dispatch = useDispatch()
    const videoItems = useSelector(state => state.videos.items)
    const isFetching = useSelector(state => state.videos.isFetching)
    const isFetchError = useSelector(state => state.videos.isFetchError)
    const nextPageToken = useSelector(state => state.videos.nextPageToken)
    const [searchVideoString, setSearchVideoString] = useState('')


    function searchHandler(searchValue) {
        if (searchValue === "") {
            return
        }
        dispatch(setVideosFromYoutube(searchValue, 10))
        setSearchVideoString(searchValue)
    }

    function endHandler() {
        if (searchVideoString === "") {
            return
        }
        dispatch(addVideosFromYoutube(searchVideoString, nextPageToken, 10))
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
                {isFetchError
                    ? <Error/>
                    : <VideoContainer videoItems={videoItems} isFetching={isFetching} endHandler={endHandler}/>
                }
            </div>
        </div>
    );
}

export default App;
