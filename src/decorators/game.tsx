import { StoryDecorator } from '@ladle/react';
import { Game, useWorldStore } from '@utils/world';
import { Stage } from '@utils/Stage';
import { useEffect } from 'react';
import '@src/index.css';

export const game: (game: Game) => StoryDecorator = (game: Game) => (Component) => {
    const { setActiveGame } = useWorldStore();
    useEffect(() => setActiveGame(game), []);

    return (
        <Stage stageProps={{ backgroundAlpha: 0 }}>
            <Component />
        </Stage>
    );
};
