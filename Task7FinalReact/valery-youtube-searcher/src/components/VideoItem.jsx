import React from 'react';

const VideoItem = (props) => {
    const videoItem = props.videoItem


    return (
        <div className="videoItem">
            {videoItem.title}
        </div>
    );
};

export default VideoItem;
