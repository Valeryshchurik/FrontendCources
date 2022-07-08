import React, {useEffect, useState, useRef} from 'react';

const Timer = ({children, settings, onComplete}) => {
    const [time, setTime] = useState([0, 0, 5])

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
            setTime((time)=>{
                let hours = time[0];
                let minutes = time[1];
                let seconds = time[2];

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
                console.log(seconds)
                return [h, m, s]}
            );
        }, 1000);
    }


    return (
        <div>
            {children(time[0], time[1], time[2])}
            &nbsp;Таймер через предыдущее значение&nbsp;
            <button onClick={() => {clearInterval(intervalId.current); setWantToStart(true); setTime([0,0,5])}}>
                Рестарт
            </button>
        </div>
    );
};

export default Timer;