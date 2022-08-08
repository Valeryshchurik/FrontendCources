import cl from 'App.module.css';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from 'components/SearchInput/SearchInput';
import { setVideosFromYoutube, addVideosFromYoutube } from 'actions/videos';
import Error from 'components/Error/Error';
import VideoContainer from 'components/VideoContainer/VideoContainer';

function App() {
    const dispatch = useDispatch();
    const videoItems = useSelector((state) => state.videos.items);
    const isFetching = useSelector((state) => state.videos.isFetching);
    const isFetchError = useSelector((state) => state.videos.isFetchError);
    const nextPageToken = useSelector((state) => state.videos.nextPageToken);
    const [searchVideoString, setSearchVideoString] = useState('');

    const searchHandler = useCallback((searchValue) => {
        if (searchValue === '') {
            return;
        }
        dispatch(setVideosFromYoutube(searchValue, 10));
        setSearchVideoString(searchValue);
    }, [dispatch]);

    const endHandler = useCallback(() => {
        if (searchVideoString === '') {
            return;
        }
        dispatch(addVideosFromYoutube(searchVideoString, nextPageToken, 10));
    }, [searchVideoString, nextPageToken, dispatch]);

    return (
        <div className={cl.app}>
            <div className={cl.head}>
                <h1>Youtube searcher</h1>
            </div>
            <div>
                <SearchInput
                    className="Big"
                    placeholder="Search"
                    onSearch={searchHandler}
                />
                {isFetchError
                    ? <Error />
                    : (
                        <VideoContainer
                            videoItems={videoItems}
                            isFetching={isFetching}
                            endHandler={endHandler}
                        />
                    )}
            </div>
        </div>
    );
}

export default App;