import './VideoItem.css';
import React from 'react';

const VideoItem = (props) => {
    const videoItem = props.videoItem
    console.log(videoItem.id)

    return (
        <div className="video-item">
            <div className="video-item__image">
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`}>
                    <img className="" src={videoItem.imageUrl} alt=""></img>
                </a>
            </div>
            <div className="video-item__info-container">
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`}>
                    <div className="video-item__info-container__title">
                        {videoItem.title}
                    </div>
                </a>
                <div className="video-item__info-container__channel">
                    {videoItem.channelTitle}
                </div>
                <div className="video-item__info-container__description">
                    {videoItem.description}
                </div>
            </div>
        </div>
    );
};

export default VideoItem;
