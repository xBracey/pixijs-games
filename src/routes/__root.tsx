import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Stage } from '../utils/Stage';
import { height, width } from '../utils/map';

export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-gray-500 text-white ">
            <Stage stageProps={{ height, width, backgroundAlpha: 0 }}>
                <Outlet />
            </Stage>
        </div>
    )
});
