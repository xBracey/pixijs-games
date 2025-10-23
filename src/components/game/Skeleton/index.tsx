import CenteredHTML from '../../dom/CenteredHTML';
import { Pixi } from '../../../utils/Pixi';
import PhysicsObjectAnimatedSprite from '../physics/PhysicsObject/PhysicsObjectAnimatedSprite';
import { useWorldStore } from '../../../zustand/world';
import { useMovement } from '../../../utils/useMovement';
import { IRect } from 'bump-ts';
import { useHealthyEaterStore } from '../../../zustand/healthy-eater';
import { useCallback, useMemo } from 'react';
import HealthBar from '../../dom/HealthBar';

const id = 'skeleton';
const initialRect = { x: 200, y: 200, h: 64, w: 64 };

const Skeleton = () => {
    const { world, rects, removeRect } = useWorldStore();
    const { health, onEat } = useHealthyEaterStore();

    const rect = rects[id] ?? initialRect;

    const onMove = useCallback(
        (rect: IRect, deltaX: number, deltaY: number) => {
            const { collisions } = world.move(id, rect.x + deltaX, rect.y + deltaY, (_, newItem) =>
                newItem.startsWith('apple') ? 'touch' : 'bounce'
            );

            if (collisions.length > 0) {
                const itemCollision = collisions[0];

                if (itemCollision.other.startsWith('apple')) {
                    world.remove(itemCollision.other);
                    removeRect(itemCollision.other);
                    onEat();
                }
            }
        },
        [world, removeRect]
    );

    const movementDirection = useMovement(id, 4, onMove);

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

    return (
        <>
            <PhysicsObjectAnimatedSprite
                id={id}
                initialRect={rect}
                animatedSprite={{
                    eventMode: 'static',
                    animationSpeed: 0.15,
                    rotation: spriteTransform.rotation,
                    scale: { x: spriteTransform.scaleX, y: spriteTransform.scaleY }
                }}
                textureProps={{ name: 'skeleton', imageNum: 4 }}
            />
            <CenteredHTML rect={rect}>
                <div className="mb-20">
                    <HealthBar health={health} />
                </div>
            </CenteredHTML>
        </>
    );
};

const SkeletonWrapped = () => (
    <Pixi.In>
        <Skeleton />
    </Pixi.In>
);

export default SkeletonWrapped;
