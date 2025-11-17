import { Html, Pixi } from '@utils/tunnel';
import { MouseEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import AnimatedGameSprite from '@game/AnimatedGameSprite';
import { AnimatedSprite } from 'pixi.js';
import { useWorldStore } from '@utils/world';
import { useTick } from '@pixi/react';

interface ILaunchArrow {
    penguinId: string;
    onJump: (angle: number, percentage: number) => void;
}

const frameNum = 25;

const LaunchArrow = ({ penguinId, onJump }: ILaunchArrow) => {
    const { rects, screen } = useWorldStore();
    const [angle, setAngle] = useState(0);

    const position = useMemo(() => {
        const penguin = rects[penguinId] ?? { x: 0, y: 0 };

        return { x: penguin.x + 96, y: penguin.y };
    }, [rects[penguinId]]);

    const spriteRef = useRef<AnimatedSprite>(null);

    const onHover: MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            const mouseX = (e.clientX - screen.x) / screen.scale;
            const mouseY = (e.clientY - screen.y) / screen.scale;

            const xDiff = mouseX - position.x;
            const yDiff = mouseY - position.y;

            const angleFromHorizontal = -Math.atan2(-yDiff, xDiff);

            setAngle(angleFromHorizontal);
        },
        [position]
    );

    const onClick = () => {
        if (!spriteRef.current) return;

        spriteRef.current.stop();

        const frame = spriteRef.current.currentFrame;
        const percentage = frame / frameNum;

        onJump(angle, percentage);
    };

    return (
        <>
            <AnimatedGameSprite
                animatedSprite={{
                    animationSpeed: 0.8,
                    x: position.x,
                    y: position.y,
                    width: 64,
                    height: 64,
                    loop: false,
                    rotation: angle,
                    anchor: 0.5
                }}
                textureProps={{
                    name: 'arrow',
                    imageNum: frameNum
                }}
                reversable
                ref={spriteRef}
            />
            <Html.In>
                <div className="absolute inset-0" onMouseMove={onHover} onClick={onClick} />
            </Html.In>
        </>
    );
};

export default LaunchArrow;
