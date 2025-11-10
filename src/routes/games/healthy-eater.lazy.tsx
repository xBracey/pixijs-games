import { createLazyFileRoute } from '@tanstack/react-router';
import HealthyEater from '../../games/HealthyEater';
import { useEffect } from 'react';
import { useWorldStore } from '@utils/world';

const Index = () => {
    const { setActiveGame } = useWorldStore();

    useEffect(() => {
        setActiveGame('healthy-eater');
    }, []);

    return <HealthyEater />;
};

export const Route = createLazyFileRoute('/games/healthy-eater')({
    component: Index
});
