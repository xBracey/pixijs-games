import { useCallback, useEffect, useState } from 'react';
import { useTick } from '@pixi/react';
import { useWorldStore } from '../zustand/world';
import { IRect } from 'bump-ts';

export type MovementDirection = 'left' | 'right' | 'up' | 'down' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export const useMovement = (
    id: string,
    speed: number,
    onMoveCallback: (rect: IRect, deltaX: number, deltaY: number) => void
): MovementDirection => {
    const { world, paused } = useWorldStore();

    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
    const [currentDirection, setCurrentDirection] = useState<MovementDirection>('left');

    const onMove = useCallback(() => {
        if (!world.hasItem(id) || paused) {
            return;
        }

        const rect = world.getRect(id);

        let deltaX = 0;
        let deltaY = 0;

        if (keysPressed.has('w')) deltaY -= speed;
        if (keysPressed.has('s')) deltaY += speed;
        if (keysPressed.has('a')) deltaX -= speed;
        if (keysPressed.has('d')) deltaX += speed;

        // Determine direction including diagonals
        let newDirection: MovementDirection = currentDirection;
        if (deltaX > 0 && deltaY < 0) newDirection = 'up-right';
        else if (deltaX > 0 && deltaY > 0) newDirection = 'down-right';
        else if (deltaX < 0 && deltaY < 0) newDirection = 'up-left';
        else if (deltaX < 0 && deltaY > 0) newDirection = 'down-left';
        else if (deltaX > 0) newDirection = 'right';
        else if (deltaX < 0) newDirection = 'left';
        else if (deltaY < 0) newDirection = 'up';
        else if (deltaY > 0) newDirection = 'down';

        setCurrentDirection(newDirection);
        onMoveCallback(rect, deltaX, deltaY);
    }, [keysPressed]);

    useTick(onMove);

    // Handle keyboard input for WASD movement
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (['w', 's', 'a', 'd'].includes(key)) {
                setKeysPressed((prev) => new Set(prev).add(key));
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (['w', 's', 'a', 'd'].includes(key)) {
                setKeysPressed((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return currentDirection;
};
