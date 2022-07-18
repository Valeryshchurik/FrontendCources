import cl from './VideoContainer.module.css';
import React from 'react';
import VideoItem from "../VideoItem/VideoItem";
import Loader from "../UI/Loader/Loader";
import {useObserver} from "../../hooks/useObserver";
import {useRef} from "react";

const VideoContainer = (props) => {
    const endListHiddenElement = useRef()
    const wantToCall = useRef(true)

    console.log(props.isFetching)
    useObserver(endListHiddenElement, true, props.isFetching, ()=>{

        if (wantToCall.current) {
            wantToCall.current = false
            props.endHandler()
        }
    })

    return (
        <div className={cl.VideoContainer}>
            {
                props.videoItems.map(videoItem => <VideoItem videoItem={videoItem}/>)
            }
            {
                props.isFetching === true && <Loader/>
            }
            {
                props.isFetching === false && props.videoItems.length > 0 &&
                <div ref={endListHiddenElement} style={{height: 20}}/>
            }
        </div>
    );
};

export default VideoContainer;