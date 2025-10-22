import { createLazyFileRoute } from '@tanstack/react-router';
import HealthyEater from '../../games/HealthyEater';

const Index = () => {
    return <HealthyEater />;
};

export const Route = createLazyFileRoute('/games/healthy-eater')({
    component: Index
});
