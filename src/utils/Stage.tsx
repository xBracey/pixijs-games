import { Application, ApplicationRef } from '@pixi/react';
import { ComponentProps, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import { initDevtools } from '@pixi/devtools';
import WorldOverlay from '../components/dom/WorldOverlay';
import { useWorldStore } from './world';
import { Html, HtmlBackground, Pixi } from './tunnel';

export function Stage({ stageProps, children }: { stageProps: ComponentProps<typeof Application>; children: ReactNode }) {
    const stageRef = useRef<ApplicationRef>(null);
    const mainDivRef = useRef<HTMLDivElement>(null);
    const hasInitDevTools = useRef(false);
    const { width, height } = useWindowSize();
    const [showDebug, setShowDebug] = useState(false);
    const { setScreen, map } = useWorldStore();

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
        return Math.min(width / map.width, height / map.height);
    }, [width, height, map]);

    useEffect(() => {
        const updateScreen = () => {
            if (!mainDivRef.current) return;

            const rect = mainDivRef.current.getBoundingClientRect();
            setScreen({ scale, x: rect.left, y: rect.top });
        };

        updateScreen();

        const resizeObserver = new ResizeObserver(updateScreen);
        const mutationObserver = new MutationObserver(updateScreen);

        if (mainDivRef.current) {
            resizeObserver.observe(mainDivRef.current);
            mutationObserver.observe(mainDivRef.current, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        window.addEventListener('scroll', updateScreen);
        window.addEventListener('resize', updateScreen);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('scroll', updateScreen);
            window.removeEventListener('resize', updateScreen);
        };
    }, [scale, setScreen]);

    return (
        <div className="flex max-h-screen items-center justify-center bg-gray-600 md:h-screen md:w-screen">
            <button
                onClick={() => setShowDebug(!showDebug)}
                className="fixed right-4 top-4 z-50 hidden rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700 md:block"
            >
                {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>

            <div
                className="relative"
                id="main"
                ref={mainDivRef}
                style={{ transform: `scale(${scale})`, height: map.height, width: map.width, minHeight: map.height, minWidth: map.width }}
            >
                <div className="absolute inset-0 z-[5]">
                    <HtmlBackground.Out />
                </div>

                <div
                    className="absolute inset-0 z-20"
                    style={{
                        height: `calc(100% * ${scale})`,
                        width: `calc(100% * ${scale})`,
                        scale: `calc(1/${scale})`,
                        transformOrigin: 'top left'
                    }}
                >
                    {children}
                    {showDebug && <WorldOverlay />}
                    <Html.Out />
                </div>

                <Application {...stageProps} ref={stageRef} className="absolute inset-0 z-10" width={map.width} height={map.height}>
                    <Pixi.Out />
                </Application>
            </div>
        </div>
    );
}
