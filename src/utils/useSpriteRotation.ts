import { useMemo } from 'react';
import { MovementDirection } from './useMovement';

export const useSpriteRotation = (movementDirection: MovementDirection) => {
    const spriteTransform = useMemo(() => {
        switch (movementDirection) {
            case 'left':
                // Default orientation (sprite is facing left)
                return { rotation: 0, scaleX: 1, scaleY: 1 };
            case 'right':
                // Flip horizontally by scaling X axis by -1
                return { rotation: 0, scaleX: -1, scaleY: 1 };
            case 'up':
                // Rotate 90 degrees counter-clockwise (to face up)
                return { rotation: Math.PI / 2, scaleX: 1, scaleY: 1 };
            case 'down':
                // Rotate 90 degrees clockwise (to face down)
                return { rotation: -Math.PI / 2, scaleX: 1, scaleY: 1 };
            case 'up-left':
                // Rotate 45 degrees counter-clockwise
                return { rotation: Math.PI / 4, scaleX: 1, scaleY: 1 };
            case 'up-right':
                // Flip horizontally and rotate 45 degrees clockwise
                return { rotation: -Math.PI / 4, scaleX: -1, scaleY: 1 };
            case 'down-left':
                // Rotate 45 degrees clockwise
                return { rotation: -Math.PI / 4, scaleX: 1, scaleY: 1 };
            case 'down-right':
                // Flip horizontally and rotate 45 degrees counter-clockwise
                return { rotation: Math.PI / 4, scaleX: -1, scaleY: 1 };
            default:
                // Idle - keep default orientation
                return { rotation: 0, scaleX: 1, scaleY: 1 };
        }
    }, [movementDirection]);

    return spriteTransform;
};
