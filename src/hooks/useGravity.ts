import { useEffect, useRef } from 'react';
import { useTick } from '@pixi/react';
import { useWorldStore } from '../utils/world';

interface GravityState {
    velocityY: number;
    isGrounded: boolean;
}

export const useGravity = (id: string, gravityValue: number, bounceValue = 0) => {
    const { world, paused } = useWorldStore();
    const gravityStateRef = useRef<GravityState>({
        velocityY: 0,
        isGrounded: false
    });

    useEffect(() => {
        // Reset gravity state when component mounts
        gravityStateRef.current = {
            velocityY: 0,
            isGrounded: false
        };
    }, [id]);

    useTick(() => {
        if (paused || !world.hasItem(id)) return;

        const currentRect = world.getRect(id);
        const gravityState = gravityStateRef.current;

        // Apply gravity to velocity
        gravityState.velocityY += gravityValue;

        // Calculate new position
        const newY = currentRect.y + gravityState.velocityY;

        // Try to move the object down
        const targetRect = {
            x: currentRect.x,
            y: newY,
            w: currentRect.w,
            h: currentRect.h
        };

        // Check for collisions when moving
        const { collisions, y } = world.move(id, targetRect.x, targetRect.y);

        // Check if we hit something (ground or other objects)
        if (collisions.length > 0) {
            // We hit something, check if it's below us (ground collision)
            const wasMovingDown = gravityState.velocityY > 0;

            if (wasMovingDown && y < newY) {
                // We hit ground while falling
                gravityState.isGrounded = true;
                gravityState.velocityY = -gravityState.velocityY * bounceValue;
            }
        } else {
            // No collision, we're in the air
            gravityState.isGrounded = false;
        }

        // Update the gravity state
        gravityStateRef.current = gravityState;
    });

    const jump = (jumpStrength: number = -10) => {
        if (gravityStateRef.current.isGrounded) {
            gravityStateRef.current.velocityY = -jumpStrength;
            gravityStateRef.current.isGrounded = false;
        }
    };

    return {
        isGrounded: gravityStateRef.current.isGrounded,
        velocityY: gravityStateRef.current.velocityY,
        jump
    };
};
