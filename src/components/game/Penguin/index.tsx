import { MouseEventHandler, useEffect, useRef } from 'react';
import { Pixi } from '../../../utils/Pixi';
import { useGravity } from '../../../utils/useGravity';
import PhysicsObjectAnimatedSprite from '../physics/PhysicsObject/PhysicsObjectAnimatedSprite';
import { AnimatedSprite } from 'pixi.js';
import { usePenguinThrowerStore } from '../../../zustand/penguin-thrower';
import { useTick } from '@pixi/react';
import { width } from '../../../utils/map';
import { Html } from '../../../utils/Html';
import { useWorldStore } from '../../../zustand/world';

interface IPenguin {}

const id = 'penguin';

const Penguin = ({}: IPenguin) => {
    const { screen, world } = useWorldStore();
    const { penguinSpeed, setPenguinSpeed, setMapLeft } = usePenguinThrowerStore();

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
        setMapLeft((mapLeft) => mapLeft + penguinSpeed);

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
