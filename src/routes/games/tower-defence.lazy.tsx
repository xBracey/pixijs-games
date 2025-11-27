import { createLazyFileRoute } from '@tanstack/react-router';
import TowerDefence from '../../games/TowerDefence';
import { useWorldStore } from '@utils/world';
import { useEffect } from 'react';

const Index = () => {
    const { setActiveGame } = useWorldStore();

    useEffect(() => {
        setActiveGame('tower-defence');
    }, []);

    return <TowerDefence />;
};

export const Route = createLazyFileRoute('/games/tower-defence')({
    component: Index
});
