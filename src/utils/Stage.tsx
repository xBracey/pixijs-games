import { Application, ApplicationRef } from '@pixi/react';
import { Pixi } from './Pixi';
import { ComponentProps, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import { height as mapHeight, width as mapWidth } from './map';
import { Html } from './Html';
import { initDevtools } from '@pixi/devtools';
import WorldOverlay from '../components/dom/WorldOverlay';

export function Stage({ stageProps, children }: { stageProps: ComponentProps<typeof Application>; children: ReactNode }) {
    const stageRef = useRef<ApplicationRef>(null);
    const hasInitDevTools = useRef(false);
    const { width, height } = useWindowSize();
    const [showDebug, setShowDebug] = useState(false);

    useEffect(() => {
        if (!stageRef.current) return;

        const interval = setInterval(() => {
            const app = stageRef?.current?.getApplication();

            if (app && !hasInitDevTools.current) {
                initDevtools({ app });
                window.__PIXI_DEVTOOLS__ = {
                    app
                };
                hasInitDevTools.current = true;
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [stageRef]);

    const scale = useMemo(() => {
        return Math.min(width / mapWidth, height / mapHeight);
    }, [width, height]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-600">
            <button
                onClick={() => setShowDebug(!showDebug)}
                className="fixed right-4 top-4 z-50 rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
            >
                {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>

            <div style={{ transform: `scale(${scale})` }}>
                <div className="fixed inset-0">
                    {children}
                    {showDebug && <WorldOverlay />}
                    <Html.Out />
                </div>

                <Application {...stageProps} ref={stageRef}>
                    <Pixi.Out />
                </Application>
            </div>
        </div>
    );
}
