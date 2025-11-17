import { useArcadeShooterStore } from './store';
import { useWorldStore } from '@utils/world';
import { HtmlBackground } from '@utils/tunnel';
import GameHeader from '@dom/GameHeader';
import { Button } from './components/Button';
import Border from '@game/Border';
import styles from './index.module.css';

const ArcadeShooter = () => {
    const { status, score, level, lives, setStatus, resetGame } = useArcadeShooterStore();
    const { paused, setPaused } = useWorldStore();

    const onHeaderButtonClick = () => {
        if (status === 'idle') {
            setStatus('playing');
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

    const handleGameOver = () => {
        resetGame();
        setStatus('idle');
    };

    const inGame = status === 'playing';

    return (
        <div className={styles.ArcadeShooterContainer}>
            <HtmlBackground.In>
                <div className="absolute inset-0 bg-gradient-to-b from-arcade-100 to-arcade-200">
                    <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-1 w-1 animate-pulse rounded-full bg-arcade-300"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </HtmlBackground.In>

            <GameHeader title="Arcade Shooter" isPlaying={status !== 'idle'} bgColor="bg-arcade-200 text-arcade-300">
                <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>
            </GameHeader>

            <Border config={{ hideUp: true, hideLeft: true, hideRight: true }} />

            {inGame && (
                <div className="absolute left-4 top-4 z-10 rounded-md bg-arcade-200 p-2 text-arcade-300">
                    <p>Score: {score.toLocaleString()}</p>
                    <p>Level: {level}</p>
                    <p>Lives: {lives}</p>
                </div>
            )}

            {status === 'gameOver' && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="rounded-lg bg-black bg-opacity-80 p-8 text-center text-arcade-300">
                        <h2 className="mb-4 text-3xl font-bold">Game Over</h2>
                        <p className="mb-2 text-xl">Final Score: {score.toLocaleString()}</p>
                        <p className="mb-4 text-lg">Level Reached: {level}</p>
                        <Button onClick={handleGameOver}>Play Again</Button>
                    </div>
                </div>
            )}

            {status === 'idle' && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="rounded-lg bg-black bg-opacity-80 p-8 text-center text-arcade-300">
                        <h2 className="mb-4 text-4xl font-bold">Arcade Shooter</h2>
                        <p className="mb-4 text-lg">Defend against waves of enemies!</p>
                        <p className="mb-6 text-sm">Use WASD to move and mouse to aim and shoot</p>
                        <Button onClick={() => setStatus('playing')}>Start Game</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArcadeShooter;
