import { Story } from '@ladle/react';
import Penguin from '.';
import { game } from '@src/decorators/game';
import Border from '@game/Border';

export const PenguinStory: Story = () => (
    <>
        <Penguin />
        <Border config={{ hideUp: true }} />
    </>
);

PenguinStory.decorators = [game('penguin-thrower')];
PenguinStory.displayName = 'Penguin';
