import { createLazyFileRoute } from '@tanstack/react-router';
import { Home } from '../pages/Home';

const Index = () => {
    return <Home />;
};

export const Route = createLazyFileRoute('/')({
    component: Index
});
