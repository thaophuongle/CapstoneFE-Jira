import React, { useEffect, useState } from 'react'

const useResponsive = () => {
    const [windowSize, setWindowSize] = useState({
        widthWindow: window.innerWidth,
        heightWindow: window.innerHeight,
    })
    useEffect(() => {
        const handler = () => {
            setWindowSize({
                widthWindow: window.innerWidth,
                heightWindow: window.innerHeight,
            });
        };
        document.addEventListener('resize', handler);
        return () => {
            document.removeEventListener('resize', handler);
        }
    });
    return windowSize;
}

export default useResponsive