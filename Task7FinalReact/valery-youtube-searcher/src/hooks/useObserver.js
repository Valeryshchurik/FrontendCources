import { useEffect, useRef } from 'react';

export const useObserver = (ref, canLoad, isLoading, callback) => {
    const observer = useRef();

    useEffect(() => {
        if (isLoading || !canLoad || !ref.current) return;
        const cb = function f(entries) {
            if (entries[0].isIntersecting) {
                callback();
            }
        };
        observer.current = new IntersectionObserver(cb);
        observer.current.observe(ref.current);
        // eslint-disable-next-line consistent-return
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [ref, canLoad, isLoading, callback]);
};
