import { useCallback, useEffect, useState } from 'react';
import { useTick } from '@pixi/react';
import { useWorldStore } from '../zustand/world';

export const useMovement = (id: string, speed: number) => {
    const { world, paused } = useWorldStore();

    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

    const onMove = useCallback(() => {
        if (!world.hasItem(id) || paused) {
            return;
        }

        const newRect = world.getRect(id);

        let deltaX = 0;
        let deltaY = 0;

        if (keysPressed.has('w')) deltaY -= speed;
        if (keysPressed.has('s')) deltaY += speed;
        if (keysPressed.has('a')) deltaX -= speed;
        if (keysPressed.has('d')) deltaX += speed;

        if (!deltaX && !deltaY) return;

        world.move(id, newRect.x + deltaX, newRect.y + deltaY);
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
};
