import styles from './index.module.css';
import { usePenguinThrowerStore } from './store';
import { useWorldStore } from '@utils/world';
import { HtmlBackground } from '@utils/tunnel';
import GameHeader from '@dom/GameHeader';
import Button from '@dom/Button';
import Border from '@game/Border';
import Penguin from './components/Penguin';
import Shop from './components/Shop';

const PenguinThrower = () => {
    const { status, score, mapLeft, setStatus, money } = usePenguinThrowerStore();
    const { paused, setPaused } = useWorldStore();
    const { map } = useWorldStore();
    const { width, height } = map;

    const onHeaderButtonClick = () => {
        if (status === 'menu') {
            setStatus('throwing');
            return;
        }

        if (paused) return setPaused(false);
        return setPaused(true);
    };

    const buttonTitle = () => {
        if (status === 'menu') return 'Start';
        if (paused) return 'Resume';
        return 'Pause';
    };

    const inGame = status === 'throwing' || status === 'threw';

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

            <GameHeader title="Penguin Thrower" isPlaying={status !== 'menu'} bgColor="bg-snow-500">
                <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>
            </GameHeader>

            <Border config={{ hideUp: true, hideLeft: true, hideRight: true }} />

            {status === 'shop' && <Shop />}

            {inGame && <Penguin />}

            {inGame && (
                <div className="absolute left-4 top-4 z-10 rounded-md bg-snow-400 p-2 text-white">
                    <p>Score: {score}</p> <p>Money: £{Math.round(money * 100) / 100}</p>
                </div>
            )}
        </div>
    );
};

export default PenguinThrower;
