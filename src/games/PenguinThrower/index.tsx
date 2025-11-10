import { useState, useEffect, useCallback } from 'react';
import styles from './index.module.css';
import { usePenguinThrowerStore } from './store';
import { useWorldStore } from '@utils/world';
import { HtmlBackground } from '@utils/tunnel';
import GameHeader from '@dom/GameHeader';
import Button from '@dom/Button';
import Border from '@game/Border';
import Penguin from './components/Penguin';

const PenguinThrower = () => {
    const { status, setStatus, score, mapLeft, resetGame } = usePenguinThrowerStore();
    const { paused, setPaused, resetWorld } = useWorldStore();
    const [showLevelTransition, setShowLevelTransition] = useState(false);
    const { map } = useWorldStore();
    const { width, height } = map;

    const onGameStart = useCallback(() => {
        setShowLevelTransition(false);
        setStatus('playing');
        resetGame();
    }, [setShowLevelTransition, setStatus, resetGame]);

    useEffect(() => {
        if (showLevelTransition) {
            const timer = setTimeout(onGameStart, 500);
            return () => clearTimeout(timer);
        }
    }, [showLevelTransition, onGameStart]);

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

    useEffect(() => {
        if (status !== 'playing') {
            resetWorld();
        }
    }, [status, resetWorld]);

    return (
        <div className={styles.PenguinThrowerContainer}>
            <HtmlBackground.In>
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute opacity-100"
                        style={{
                            left: -mapLeft,
                            backgroundImage: 'url(/assets/penguin-thrower/map.png)',
                            height,
                            width: width * 3
                        }}
                    />
                    <div
                        className="absolute opacity-100"
                        style={{
                            left: -mapLeft + width * 3 - 5,
                            backgroundImage: 'url(/assets/penguin-thrower/map.png)',
                            height,
                            width: width * 3
                        }}
                    />
                </div>
            </HtmlBackground.In>

            <GameHeader title="Penguin Thrower" isPlaying={status === 'playing'} bgColor="bg-snow-500">
                {!showLevelTransition && <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>}
            </GameHeader>

            <Border config={{ hideUp: true, hideLeft: true, hideRight: true }} />

            {status === 'playing' && <Penguin />}

            {status === 'playing' && (
                <div className="absolute left-4 top-4 z-10 rounded-md bg-snow-400 p-2 text-white">
                    <p>Score: {score}</p>
                </div>
            )}
        </div>
    );
};

export default PenguinThrower;
