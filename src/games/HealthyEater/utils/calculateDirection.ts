import { MovementBasicDirection } from '@hooks/useMovement';

export const calculateDirection = (id: number, levelStartTimestamp: number): MovementBasicDirection => {
    const directionNum = (levelStartTimestamp + id) % 4;
    if (directionNum === 0) return 'up';
    if (directionNum === 1) return 'down';
    if (directionNum === 2) return 'left';
    return 'right';
};
