import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWorldStore } from '@utils/world';
import ArcadeShooter from '@src/games/ArcadeShooter';

const Index = () => {
    const { setActiveGame, setGridSize, setMap } = useWorldStore();

    useEffect(() => {
        setActiveGame('arcade-shooter');
        setGridSize(32);
        setMap({ width: 480, height: 270 });
    }, []);

    return <ArcadeShooter />;
};

export const Route = createLazyFileRoute('/games/arcade-shooter')({
    component: Index
});
