import { useMemo } from 'react';
import { useWorldStore } from '@utils/world';
import GameSprite from '@game/GameSprite';

interface IBackpack {
    penguinId: string;
}

const Backpack = ({ penguinId }: IBackpack) => {
    const { rects } = useWorldStore();

    const position = useMemo(() => {
        const penguin = rects[penguinId] ?? { x: 0, y: 0 };

        return penguin;
    }, [rects[penguinId]]);

    return <GameSprite sprite={{ ...position, height: 64, width: 64 }} textureName="backpack" />;
};

export default Backpack;
