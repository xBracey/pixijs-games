import { createLazyFileRoute } from '@tanstack/react-router';
import PenguinThrower from '../../games/PenguinThrower';
import { useWorldStore } from '@utils/world';
import { useEffect } from 'react';

const Index = () => {
    const { setActiveGame } = useWorldStore();

    useEffect(() => {
        setActiveGame('penguin-thrower');
    }, []);

    return <PenguinThrower />;
};

export const Route = createLazyFileRoute('/games/penguin-thrower')({
    component: Index
});
