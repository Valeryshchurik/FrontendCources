import cl from 'components/VideoContainer/VideoContainer.module.css';
import React, { useRef } from 'react';
import VideoItem from 'components/VideoItem/VideoItem';
import Loader from 'components/UI/Loader/Loader';
import { useObserver } from 'hooks/useObserver';

function VideoContainer(props) {
    const endListHiddenElement = useRef();

    useObserver(endListHiddenElement, true, props.isFetching, () => {
        props.endHandler();
    });

    return (
        <div className={cl.videoContainer}>
            {
                props.videoItems.map(
                    (videoItem) => <VideoItem key={videoItem.id} videoItem={videoItem} />,
                )
            }
            {
                props.isFetching === true && <Loader />
            }
            {
                props.isFetching === false && props.videoItems.length > 0
                && <div ref={endListHiddenElement} style={{ height: 20 }} />
            }
        </div>
    );
}

export default VideoContainer;
