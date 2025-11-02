import { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../../components/dom/Button';
import GameHeader from '../../components/dom/GameHeader';
import Apple from '../../components/game/Apple';
import Arrow from '../../components/game/Arrow';
import Skeleton from '../../components/game/Skeleton';
import { useHealthyEaterStore } from '../../zustand/healthy-eater';
import { useWorldStore } from '../../zustand/world';
import Border from '../../components/game/Border';
import { calculateRandomXY } from './calculateRandomXY';
import { calculateDirection } from './calculateDirection';
import { height, width } from '../../utils/map';
import { HtmlBackground } from '../../utils/HtmlBackground';
import { PauseableTimeout } from '../../utils/Timer';

const foodMap: Record<number, number> = {
    1: 10,
    2: 15,
    3: 20,
    4: 20,
    5: 25
};

const foodFrequency = 2000;
const arrowFrequency = 500;

const HealthyEater = () => {
    const {
        status,
        setStatus,
        level,
        setHealth,
        setFoodLeft,
        foodActive,
        setFoodActive,
        levelStartTimestamp,
        setLevelStartTimestamp,
        removeFoodActive,
        removeArrowsActive,
        arrowsActive,
        setArrowsActive
    } = useHealthyEaterStore();
    const { paused, setPaused, resetWorld } = useWorldStore();
    const [showLevelTransition, setShowLevelTransition] = useState(false);
    const foodTimeouts = useRef<PauseableTimeout[]>([]);

    const onLevelStart = useCallback(() => {
        const newFoodLeft = foodMap[level] ?? 25;
        setHealth(50);
        setFoodLeft(newFoodLeft);
        setShowLevelTransition(false);
        setStatus('playing');
        setLevelStartTimestamp(Date.now());

        const numbers = Array.from({ length: newFoodLeft }, (_, i) => i + 1);

        for (let index = 0; index < numbers.length; index++) {
            const number = numbers[index];
            console.log(number);
            foodTimeouts.current.push(
                new PauseableTimeout(() => {
                    setFoodLeft((foodLeft) => foodLeft - 1);
                    setFoodActive((foodActive) => [...foodActive, number]);
                }, foodFrequency * number)
            );
        }
    }, [level, setHealth, setFoodLeft, setShowLevelTransition, setStatus, setFoodActive]);

    useEffect(() => {
        if (paused) {
            foodTimeouts.current.forEach((timeout) => timeout.pause());
        }

        if (status !== 'playing' || paused) return;

        foodTimeouts.current.forEach((timeout) => timeout.start());

        const arrowInterval = setInterval(() => {
            setArrowsActive((arrowsActive) =>
                arrowsActive.length ? [...arrowsActive, arrowsActive[arrowsActive.length - 1] + 1] : [Date.now()]
            );
        }, arrowFrequency);

        return () => clearInterval(arrowInterval);
    }, [status, paused]);

    useEffect(() => {
        if (showLevelTransition) {
            const timer = setTimeout(onLevelStart, 2000);
            return () => clearTimeout(timer);
        }
    }, [showLevelTransition, onLevelStart]);

    const onHeaderButtonClick = () => {
        if (status === 'idle' || status === 'nextLevel' || status === 'gameOver') {
            setShowLevelTransition(true);
            return;
        }
        if (paused) return setPaused(false);
        return setPaused(true);
    };

    const buttonTitle = () => {
        if (status === 'idle') return 'Start';
        if (status === 'nextLevel') return 'Next Level';
        if (status === 'gameOver') return 'Start Again';
        if (paused) return 'Resume';
        return 'Pause';
    };

    const onAte = (id: number) => () => removeFoodActive(id);
    const onRemoveArrow = (id: number) => () => removeArrowsActive(id);

    useEffect(() => {
        if (status !== 'playing') {
            foodTimeouts.current.forEach((timeout) => timeout.clear());
            foodTimeouts.current = [];
            resetWorld();
        }
    }, [status]);

    return (
        <div className="relative">
            <HtmlBackground.In>
                <div className="absolute inset-0 bg-black">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: 'url(/assets/background/dungeon.png)',
                            backgroundSize: 'cover',
                            height,
                            width
                        }}
                    />
                </div>
            </HtmlBackground.In>

            <GameHeader title="Healthy Eater" isPlaying={status === 'playing'}>
                {!showLevelTransition && <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>}
            </GameHeader>

            {showLevelTransition && (
                <h2 className="absolute left-1/2 top-24 z-10 -translate-x-1/2 transform border-b-2 pb-1 text-center text-xl">
                    {status === 'gameOver' ? 'Game Over' : `Level ${level}`}
                </h2>
            )}

            {status === 'playing' && <Border />}

            {status === 'playing' && <Skeleton />}

            {levelStartTimestamp &&
                status === 'playing' &&
                foodActive.map((id) => {
                    const { x, y } = calculateRandomXY(id, levelStartTimestamp);

                    return <Apple key={`${levelStartTimestamp}_${id}`} id={id} x={x} y={y} onAte={onAte(id)} />;
                })}

            {levelStartTimestamp &&
                status === 'playing' &&
                arrowsActive.map((id) => {
                    const { x, y } = calculateRandomXY(id, levelStartTimestamp);
                    const direction = calculateDirection(id, levelStartTimestamp);

                    return (
                        <Arrow
                            key={`${levelStartTimestamp}_${id}`}
                            id={id}
                            x={x}
                            y={y}
                            speed={12}
                            direction={direction}
                            onRemoveArrow={onRemoveArrow(id)}
                        />
                    );
                })}
        </div>
    );
};

export default HealthyEater;
