import { MouseEventHandler, useEffect, useRef } from 'react';
import { AnimatedSprite } from 'pixi.js';
import { useTick } from '@pixi/react';
import { useWorldStore } from '@utils/world';
import { usePenguinThrowerStore } from '../../store';
import { useGravity } from '@hooks/useGravity';
import { Html, Pixi } from '@utils/tunnel';
import PhysicsObjectAnimatedSprite from '@physics/PhysicsObjectAnimatedSprite';

interface IPenguin {}

const id = 'penguin';

const Penguin = ({}: IPenguin) => {
    const { screen, world } = useWorldStore();
    const { penguinSpeed, setPenguinSpeed, setMapLeft } = usePenguinThrowerStore();
    const {
        map: { width: mapWidth }
    } = useWorldStore();

    const spriteRef = useRef<AnimatedSprite>(null);
    const { jump, isGrounded } = useGravity(id, 0.2, 0.7);

    useEffect(() => {
        if (isGrounded) {
            setPenguinSpeed((penguinSpeed) => Math.max(penguinSpeed * 0.8, 0));
            spriteRef.current?.gotoAndStop(0);
        } else {
            spriteRef.current?.play();
        }
    }, [isGrounded]);

    useTick(() => {
        setMapLeft((mapLeft) => mapLeft + penguinSpeed, mapWidth);

        if (isGrounded && penguinSpeed > 0) {
            if (penguinSpeed < 0.01) {
                setPenguinSpeed(0);
                return;
            }

            setPenguinSpeed((penguinSpeed) => Math.max(penguinSpeed * 0.9, 0));
        }
    });

    const onLaunch: MouseEventHandler<HTMLDivElement> = (e) => {
        if (!isGrounded) return;

        const x = (e.clientX - screen.x) / screen.scale;
        const y = (e.clientY - screen.y) / screen.scale;

        const penguin = world.getRect(id);

        const launchSpeed = 0.05;

        const xDiff = Math.abs(x - penguin.x) * launchSpeed;
        const yDiff = Math.abs(y - penguin.y) * launchSpeed;

        jump(yDiff);
        setPenguinSpeed((penguinSpeed) => penguinSpeed + xDiff);
    };

    return (
        <>
            <Html.In>
                <div className="absolute inset-0" onClick={onLaunch} />
            </Html.In>
            <PhysicsObjectAnimatedSprite
                id={id}
                initialRect={{ x: 50, y: 500, w: 64, h: 64 }}
                animatedSprite={{
                    animationSpeed: 0.4
                }}
                textureProps={{ name: 'penguin', imageNum: 10 }}
                useSpriteSheet
                autoplay={false}
                ref={spriteRef}
            />
        </>
    );
};

const PenguinWrapped = (props: IPenguin) => (
    <Pixi.In>
        <Penguin {...props} />
    </Pixi.In>
);

export default PenguinWrapped;
