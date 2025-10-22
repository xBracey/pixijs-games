import { useEffect, useState } from 'react';

const Loading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((progress) => {
                if (progress < 100) {
                    return progress + 100 / 16;
                }

                return 0;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-12 border-white border-4 bg-black">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default Loading;
