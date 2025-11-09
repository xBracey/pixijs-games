import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Stage } from '../utils/Stage';

export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-gray-500 text-white ">
            <Stage stageProps={{ backgroundAlpha: 0 }}>
                <Outlet />
            </Stage>
        </div>
    )
});
