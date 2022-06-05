import React, {useEffect, useState} from 'react';

const Timer = ({children, settings, onComplete}) => {

    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(5)

    const [started, setStarted] = useState(false);
    let intervalId
    useEffect(() => {
        if (!started) {
            setStarted(true)
            startTimer();
        }
    });

    function startTimer() {
        intervalId = setInterval(function(){countDown()}, 1000);
    }

    function countDown() {
        let s = seconds - 1;

        if (s === -1) {
            let m = minutes - 1;
            s = 59;
            if (m === -1){
                let h = hours -1;
                m = 59
                if (h === -1){
                    setSeconds(0)
                    setMinutes(0)
                    setHours(0)
                }
                setHours(h)
            }
            setMinutes(m)
        }
        setSeconds(s)
        console.log(seconds)
    }

    return (
        <div>
            {children(hours, minutes, seconds)}
        </div>
    );
};

export default Timer;