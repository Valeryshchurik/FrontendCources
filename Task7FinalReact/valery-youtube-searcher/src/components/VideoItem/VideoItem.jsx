import React from 'react';
import cl from './VideoItem.module.css';

function VideoItem(props) {
    const { videoItem } = props;

    return (
        <div className={cl.videoItem}>
            <div className={cl.videoItem__image}>
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`} rel="noreferrer">
                    <img className="" src={videoItem.imageUrl} alt="" />
                </a>
            </div>
            <div className={cl.videoItem__infoContainer}>
                <a target="_blank" href={`https://www.youtube.com/watch?v=${videoItem.id}`} rel="noreferrer">
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
}

export default VideoItem;
