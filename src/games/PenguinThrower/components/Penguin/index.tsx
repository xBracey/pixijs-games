import { useCallback, useEffect, useRef } from 'react';
import { AnimatedSprite } from 'pixi.js';
import { useTick } from '@pixi/react';
import { useWorldStore } from '@utils/world';
import { usePenguinThrowerStore } from '../../store';
import { useGravity } from '@hooks/useGravity';
import { Pixi } from '@utils/tunnel';
import PhysicsObjectAnimatedSprite from '@physics/PhysicsObjectAnimatedSprite';
import LaunchArrow from '../LaunchArrow';
import GameSprite from '@game/GameSprite';
import Backpack from '../Backpack';

interface IPenguin {}

const id = 'penguin';

const Penguin = ({}: IPenguin) => {
    const {
        status,
        penguinSpeed,
        setPenguinSpeed,
        setMapLeft,
        setStatus,
        bounciness,
        launchPower,
        backpack,
        launchNumber,
        increaseLaunchNumber,
        resetLaunchNumber
    } = usePenguinThrowerStore();
    const {
        map: { width: mapWidth }
    } = useWorldStore();

    const spriteRef = useRef<AnimatedSprite>(null);
    const { jump, isGrounded } = useGravity(id, 0.2, bounciness);

    useEffect(() => {
        if (isGrounded) {
            setPenguinSpeed((penguinSpeed) => Math.max(penguinSpeed * 0.8, 0));
            spriteRef.current?.gotoAndStop(0);
        } else {
            spriteRef.current?.play();
        }
    }, [isGrounded]);

    useTick(() => {
        setMapLeft((mapLeft) => Math.max(mapLeft + penguinSpeed, 0), mapWidth);

        if (isGrounded && penguinSpeed > 0) {
            if (penguinSpeed < 0.01) {
                setPenguinSpeed(0);
                return;
            }

            setPenguinSpeed((penguinSpeed) => Math.max(penguinSpeed * 0.9, 0));
        }
    });

    const onJump = useCallback(
        (angle: number, percentage: number) => {
            const x = Math.cos(-angle);
            const y = Math.sin(-angle);
            const power = 20 * launchPower;

            jump(y * percentage * power);
            setPenguinSpeed((penguinSpeed) => penguinSpeed + x * percentage * power);

            if (backpack > launchNumber) {
                increaseLaunchNumber();
            } else {
                resetLaunchNumber();
                setStatus('threw');
            }
        },
        [launchPower, backpack, launchNumber, increaseLaunchNumber, setStatus]
    );

    useEffect(() => {
        if (status === 'threw' && penguinSpeed === 0) {
            setStatus('shop');
        }
    }, [penguinSpeed, status]);

    return (
        <>
            {isGrounded && status === 'throwing' && <LaunchArrow penguinId={id} onJump={onJump} />}
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

            {!!backpack && <Backpack penguinId={id} />}
        </>
    );
};

const PenguinWrapped = (props: IPenguin) => (
    <Pixi.In>
        <Penguin {...props} />
    </Pixi.In>
);

export default PenguinWrapped;
