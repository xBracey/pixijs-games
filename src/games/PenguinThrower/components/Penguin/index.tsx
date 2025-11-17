import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedSprite } from 'pixi.js';
import { useTick } from '@pixi/react';
import { useWorldStore } from '@utils/world';
import { usePenguinThrowerStore } from '../../store';
import { useGravity } from '@hooks/useGravity';
import { Pixi } from '@utils/tunnel';
import PhysicsObject from '@physics/PhysicsObject';
import AnimatedGameSprite from '@game/AnimatedGameSprite';
import LaunchArrow from '../LaunchArrow';
import GameSprite from '@game/GameSprite';

interface IPenguin {}

const wingStrength = 0.25;

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
        resetLaunchNumber,
        hasWings
    } = usePenguinThrowerStore();

    const {
        map: { width: mapWidth }
    } = useWorldStore();

    const spriteRef = useRef<AnimatedSprite>(null);
    const eatingFishRef = useRef<AnimatedSprite>(null);
    const wingingRef = useRef<AnimatedSprite>(null);
    const { jump, isGrounded, gravityStateRef } = useGravity(id, 0.2, bounciness);
    const [isEating, setIsEating] = useState(false);
    const [isWinging, setIsWinging] = useState(false);
    const [hasWinged, setHasWinged] = useState(false);

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

        if (isWinging) {
            gravityStateRef.current.velocityY += -wingStrength;
        }

        if (isGrounded && penguinSpeed > 0) {
            if (penguinSpeed < 0.01) {
                if (status !== 'threw') {
                    setIsEating(true);
                    eatingFishRef.current?.gotoAndPlay(0);
                }
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

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space' && hasWings && !isGrounded && !hasWinged) {
                setIsWinging(true);
                setHasWinged(true);
                wingingRef.current?.gotoAndPlay(0);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [hasWings, isGrounded, hasWinged]);

    const onFinishedEating = () => {
        setIsEating(false);
        setHasWinged(false);
    };

    const onFinishedWinging = () => {
        setIsWinging(false);
    };

    return (
        <>
            {isGrounded && penguinSpeed === 0 && status === 'throwing' && !isEating && <LaunchArrow penguinId={id} onJump={onJump} />}
            <PhysicsObject id={id} initialRect={{ x: 50, y: 500, w: 64, h: 64 }}>
                <AnimatedGameSprite
                    animatedSprite={{
                        animationSpeed: 0.4,
                        alpha: isEating ? 0 : 1
                    }}
                    textureProps={{ name: 'penguin', imageNum: 10 }}
                    autoplay={false}
                    ref={spriteRef}
                />
                {!!backpack && <GameSprite sprite={{ height: 64, width: 64 }} textureName="backpack" />}
                {!!hasWings && (
                    <AnimatedGameSprite
                        animatedSprite={{ height: 64, width: 64, animationSpeed: 0.1, loop: false, onComplete: onFinishedWinging }}
                        autoplay={false}
                        textureProps={{ name: 'wings', imageNum: 5 }}
                        ref={wingingRef}
                    />
                )}
                <AnimatedGameSprite
                    animatedSprite={{
                        animationSpeed: 0.3,
                        alpha: isEating ? 1 : 0,
                        loop: false,
                        onComplete: onFinishedEating
                    }}
                    textureProps={{
                        name: 'penguin-fish',
                        imageNum: 16
                    }}
                    autoplay={false}
                    ref={eatingFishRef}
                />
            </PhysicsObject>
        </>
    );
};

const PenguinWrapped = (props: IPenguin) => (
    <Pixi.In>
        <Penguin {...props} />
    </Pixi.In>
);

export default PenguinWrapped;
