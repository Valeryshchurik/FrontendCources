import React from 'react';
import {useEffect, useState, useRef} from "react";

const TimerOnRef = ({children, settings, onComplete}) => {
    const time = useRef([0, 0, 5])
    const [time_for_render, setTimeForRender] = useState(time.current)

    const [want_to_start, setWantToStart] = useState(true);
    const intervalId = useRef();
    useEffect(() => {
        if (want_to_start) {
            setWantToStart(false)
            startTimer();
        }
    }, [want_to_start]);

    function startTimer() {
        intervalId.current = setInterval(() => {
            let hours = time.current[0];
            let minutes = time.current[1];
            let seconds = time.current[2];

            let h = hours;
            let m = minutes;
            let s = seconds - 1;


            if (s === -1) {
                let m = minutes - 1;
                s = 59;
                if (m === -1){
                    let h = hours -1;
                    m = 59;  // Why do webstorm is lying to me?
                    if (h === -1){
                        s=0;
                        m=0;  // Why do webstorm is lying to me?
                        h=0;  // Why do webstorm is lying to me?
                        clearInterval(intervalId.current)
                    }
                }
            }
            console.log(seconds);
            time.current = [h, m, s];
            setTimeForRender(time.current)
        }, 1000);
    }
    return (
        <div>
            {children(time_for_render[0], time_for_render[1], time_for_render[2])}
            &nbsp;Таймер через useRef&nbsp;
            <button onClick={() => {
                clearInterval(intervalId.current); setWantToStart(true);
                time.current = [0,0,5];
                setTimeForRender(time.current);
            }}>
                Рестарт
            </button>
        </div>
    );
};

export default TimerOnRef;