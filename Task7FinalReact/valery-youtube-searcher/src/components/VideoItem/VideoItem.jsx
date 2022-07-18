import cl from './VideoItem.module.css';
import React from 'react';

const VideoItem = (props) => {
    const videoItem = props.videoItem
    console.log(videoItem.id)

    return (
        <div className={cl.videoItem}>
            <div className={cl.videoItem__image}>
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`}>
                    <img className="" src={videoItem.imageUrl} alt=""></img>
                </a>
            </div>
            <div className={cl.videoItem__infoContainer}>
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`}>
                    <div className={cl.videoItem__infoContainer__title}>
                        {videoItem.title}
                    </div>
                </a>
                <div className={cl.videoItem__infoContainer__channel}>
                    {videoItem.channelTitle}
                </div>
                <div>
                    {videoItem.description}
                </div>
            </div>
        </div>
    );
};

export default VideoItem;
