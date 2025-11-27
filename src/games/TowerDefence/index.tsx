import { useTowerDefenceStore } from './store';
import { useWorldStore } from '@utils/world';
import { HtmlBackground } from '@utils/tunnel';
import GameHeader from '@dom/GameHeader';
import Button from '@dom/Button';
import Border from '@game/Border';
import { useEffect } from 'react';

const TowerDefence = () => {
    const {
        status,
        setStatus,
        score,
        lives,
        money,
        wave,
        waveInProgress,
        setWaveInProgress,
        resetGame,
        selectedTowerType,
        setSelectedTowerType
    } = useTowerDefenceStore();
    const { paused, setPaused } = useWorldStore();

    useEffect(() => {
        if (status !== 'menu') {
            resetGame();
        }
    }, [status, resetGame]);

    const onHeaderButtonClick = () => {
        if (status === 'menu') {
            setStatus('playing');
            return;
        }

        if (status === 'gameOver') {
            setStatus('menu');
            return;
        }

        if (paused) return setPaused(false);
        return setPaused(true);
    };

    const buttonTitle = () => {
        if (status === 'menu') return 'Start';
        if (status === 'gameOver') return 'Restart';
        if (paused) return 'Resume';
        return 'Pause';
    };

    const startWave = () => {
        if (!waveInProgress) {
            setWaveInProgress(true);
        }
    };

    const selectTower = (type: 'basic' | 'advanced' | 'super') => {
        setSelectedTowerType(selectedTowerType === type ? null : type);
    };

    const getTowerCost = (type: string) => {
        switch (type) {
            case 'basic':
                return 50;
            case 'advanced':
                return 100;
            case 'super':
                return 200;
            default:
                return 0;
        }
    };

    const canAffordTower = (type: string) => {
        return money >= getTowerCost(type);
    };

    const inGame = status === 'playing';

    return (
        <div className="relative h-full w-full">
            <HtmlBackground.In>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(/assets/tower-defence/bg.png)',
                        height: '100%',
                        width: '100%',
                        backgroundSize: 'contain'
                    }}
                />
            </HtmlBackground.In>

            <GameHeader title="Tower Defence" isPlaying={status !== 'menu'} bgColor="bg-yellow-600">
                <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>
            </GameHeader>

            <Border config={{ hideUp: true, hideLeft: true, hideRight: true }} />

            {status === 'menu' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold">Tower Defence</h2>
                        <p className="mb-6 text-gray-600">Defend your base by placing towers to stop enemy waves!</p>
                        <Button onClick={() => setStatus('playing')}>Start Game</Button>
                    </div>
                </div>
            )}

            {status === 'gameOver' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold text-red-600">Game Over!</h2>
                        <p className="mb-2 text-lg">Final Score: {score}</p>
                        <p className="mb-6 text-lg">Wave Reached: {wave}</p>
                        <Button onClick={() => setStatus('menu')}>Play Again</Button>
                    </div>
                </div>
            )}

            {inGame && !paused && (
                <>
                    <div className="absolute left-4 top-16 z-10 rounded-md bg-green-800 p-4 shadow-lg">
                        <div className="mb-2 text-sm font-semibold">Game Stats</div>
                        <div className="space-y-1 text-sm">
                            <div>Score: {score}</div>
                            <div>Lives: {lives}</div>
                            <div>Money: ${money}</div>
                            <div>Wave: {wave}</div>
                        </div>

                        <div className="mt-4">
                            <Button onClick={startWave} disabled={waveInProgress} className="w-full">
                                {waveInProgress ? 'Wave Active' : 'Start Wave'}
                            </Button>
                        </div>
                    </div>

                    <div className="absolute right-4 top-16 z-10 rounded-md bg-green-800 p-4 shadow-lg">
                        <div className="mb-2 text-sm font-semibold">Towers</div>
                        <div className="space-y-2">
                            <Button onClick={() => selectTower('basic')} disabled={!canAffordTower('basic')} className={`w-full text-sm`}>
                                Basic Tower ($50)
                            </Button>
                            <Button
                                onClick={() => selectTower('advanced')}
                                disabled={!canAffordTower('advanced')}
                                className={`w-full text-sm`}
                            >
                                Advanced Tower ($100)
                            </Button>
                            <Button onClick={() => selectTower('super')} disabled={!canAffordTower('super')} className={`w-full text-sm`}>
                                Super Tower ($200)
                            </Button>
                        </div>

                        {selectedTowerType && <div className="mt-2 text-xs text-gray-600">Click on the map to place tower</div>}
                    </div>
                </>
            )}
        </div>
    );
};

export default TowerDefence;
