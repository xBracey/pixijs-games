import Button from '../../components/dom/Button';
import GameHeader from '../../components/dom/GameHeader';
import Apple from '../../components/game/Apple';
import Skeleton from '../../components/game/Skeleton';
import { useHealthyEaterStore } from '../../zustand/healthy-eater';
import { useWorldStore } from '../../zustand/world';

const HealthyEater = () => {
    const { status, setStatus } = useHealthyEaterStore();
    const { paused, setPaused } = useWorldStore();

    const onHeaderButtonClick = () => {
        if (status === 'idle') return setStatus('playing');
        if (paused) return setPaused(false);
        return setPaused(true);
    };

    const buttonTitle = () => {
        if (status === 'idle') return 'Start';
        if (paused) return 'Resume';
        return 'Pause';
    };

    return (
        <div>
            <GameHeader title="Healthy Eater">
                <Button onClick={onHeaderButtonClick}>{buttonTitle()}</Button>
            </GameHeader>
            <h2 className="absolute left-1/2 top-4 -translate-x-1/2">Eat the apples, dodge the arrows</h2>

            {status === 'playing' && <Skeleton />}

            {status === 'playing' && <Apple id="1" x={500} y={300} />}
        </div>
    );
};

export default HealthyEater;
