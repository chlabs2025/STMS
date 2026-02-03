import { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, speed = 100, deleteSpeed = 50, className = "", cursor = true, loop = true, delay = 2000 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;

        if (!isDeleting && currentIndex < text.length) {
            // Typing
            // Add a slight random variation for natural feeling
            const randomSpeed = speed + Math.random() * (speed * 0.5);
            timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, randomSpeed);
        } else if (isDeleting && currentIndex > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setDisplayedText(prev => prev.slice(0, -1));
                setCurrentIndex(prev => prev - 1);
            }, deleteSpeed);
        } else if (!isDeleting && currentIndex === text.length && loop) {
            // Finished typing, wait before deleting
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, delay);
        } else if (isDeleting && currentIndex === 0 && loop) {
            // Finished deleting, start typing
            setIsDeleting(false);
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, isDeleting, speed, deleteSpeed, text, loop, delay]);

    return (
        <span>
            <span className={className}>
                {displayedText}
            </span>
            {cursor && (
                <span className="animate-pulse font-light text-white ml-1">|</span>
            )}
        </span>
    );
};

export default TypewriterEffect;
