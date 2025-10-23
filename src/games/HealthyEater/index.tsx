import { useState, useEffect, useCallback } from 'react';
import Button from '../../components/dom/Button';
import GameHeader from '../../components/dom/GameHeader';
import Apple from '../../components/game/Apple';
import Skeleton from '../../components/game/Skeleton';
import { useHealthyEaterStore } from '../../zustand/healthy-eater';
import { useWorldStore } from '../../zustand/world';
import { height as mapHeight, width as mapWidth } from '../../utils/map';
import Border from '../../components/game/Border';

const foodMap: Record<number, number> = {
    1: 10,
    2: 15,
    3: 20,
    4: 20,
    5: 25
};

const foodFrequency = 2000;

const calculateRandomXY = (id: number, levelStartTimestamp: number) => {
    // Create a pseudo-random seed by combining timestamp and id
    const seed = (levelStartTimestamp % 20000) + id * 12345;
    const seed2 = (levelStartTimestamp % 20000) + id * 54321;

    // Simple pseudo-random number generator using linear congruential generator
    const random = (s: number) => {
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        return ((a * s + c) % m) / m;
    };

    const x = Math.floor(random(seed) * (mapWidth - 64));
    const y = Math.floor(random(seed2) * (mapHeight - 64));

    return { x, y };
};

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
        removeFoodActive
    } = useHealthyEaterStore();
    const { paused, setPaused } = useWorldStore();
    const [showLevelTransition, setShowLevelTransition] = useState(false);

    const onLevelStart = useCallback(() => {
        const newFoodLeft = foodMap[level] ?? 25;
        setHealth(20);
        setFoodLeft(newFoodLeft);
        setShowLevelTransition(false);
        setStatus('playing');
        setLevelStartTimestamp(Date.now());

        const numbers = Array.from({ length: newFoodLeft }, (_, i) => i + 1);

        for (let index = 0; index < numbers.length; index++) {
            const number = numbers[index];
            setTimeout(() => {
                setFoodLeft((foodLeft) => foodLeft - 1);
                setFoodActive((foodActive) => [...foodActive, number]);
            }, foodFrequency * number);
        }
    }, [setHealth, setFoodLeft, setShowLevelTransition, setStatus, setFoodActive]);

    useEffect(() => {
        if (showLevelTransition) {
            const timer = setTimeout(onLevelStart);
            return () => clearTimeout(timer);
        }
    }, [showLevelTransition, onLevelStart]);

    const onHeaderButtonClick = () => {
        if (status === 'idle') {
            setShowLevelTransition(true);
            return;
        }
        if (paused) return setPaused(false);
        return setPaused(true);
    };

    const buttonTitle = () => {
        if (status === 'idle') return 'Start';
        if (paused) return 'Resume';
        return 'Pause';
    };

    const onAte = (id: number) => () => removeFoodActive(id);

    return (
        <div className="relative">
            <GameHeader title="Healthy Eater" isPlaying={status === 'playing'}>
                {!showLevelTransition && <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>}
            </GameHeader>

            {showLevelTransition && (
                <h2 className="absolute left-1/2 top-24 z-10 -translate-x-1/2 transform border-b-2 pb-1 text-center text-xl">
                    Level {level}
                </h2>
            )}

            <Border />

            {status === 'playing' && <Skeleton />}

            {levelStartTimestamp &&
                foodActive.map((id) => {
                    const { x, y } = calculateRandomXY(id, levelStartTimestamp);

                    return <Apple key={id} id={id} x={x} y={y} onAte={onAte(id)} />;
                })}
        </div>
    );
};

export default HealthyEater;
