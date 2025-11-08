import { createLazyFileRoute } from '@tanstack/react-router';
import PenguinThrower from '../../games/PenguinThrower';

const Index = () => {
    return <PenguinThrower />;
};

export const Route = createLazyFileRoute('/games/penguin-thrower')({
    component: Index
});