import {useEffect, useRef} from "react";

export const useObserver = (ref, canLoad, isLoading, callback) => {
    const observer = useRef();

    useEffect(() => {
        console.log('USE EFFECT')
        if(isLoading || !canLoad || !ref.current) return;
        if(observer.current) observer.current.disconnect();

        var cb = function(entries, observer) {
            if (entries[0].isIntersecting) {
                callback()
            }
        };
        observer.current = new IntersectionObserver(cb);
        observer.current.observe(ref.current)
    }, [isLoading])
}
