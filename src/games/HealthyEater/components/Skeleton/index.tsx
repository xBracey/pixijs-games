import { useWorldStore } from '@utils/world';
import { IRect } from 'bump-ts';
import { useCallback } from 'react';
import { useHealthyEaterStore } from '../../store';
import { useMovement } from '@hooks/useMovement';
import { useSpriteRotation } from '@hooks/useSpriteRotation';
import PhysicsObject from '@physics/PhysicsObject';
import AnimatedGameSprite from '@game/AnimatedGameSprite';
import CenteredHTML from '@dom/CenteredHTML';
import HealthBar from '../HealthBar';
import { Pixi } from '@utils/tunnel';

const id = 'skeleton';
const initialRect = { x: 200, y: 200, h: 64, w: 64 };

const Skeleton = () => {
    const { world, rects, removeRect } = useWorldStore();
    const { health, onEat, onHit } = useHealthyEaterStore();

    const rect = rects[id] ?? initialRect;

    const onMove = useCallback(
        (rect: IRect, deltaX: number, deltaY: number) => {
            const { collisions } = world.move(id, rect.x + deltaX, rect.y + deltaY, (_, newItem) =>
                newItem.startsWith('apple') || newItem.startsWith('arrow') ? 'cross' : 'bounce'
            );

            collisions.forEach((itemCollision) => {
                if (itemCollision.other.startsWith('apple')) {
                    world.remove(itemCollision.other);
                    removeRect(itemCollision.other);
                    onEat();
                }
                if (itemCollision.other.startsWith('arrow')) {
                    world.remove(itemCollision.other);
                    removeRect(itemCollision.other);
                    onHit();
                }
            });
        },
        [world, removeRect]
    );

    const movementDirection = useMovement(id, 6, onMove);
    const spriteTransform = useSpriteRotation(movementDirection);

    return (
        <>
            <PhysicsObject id={id} initialRect={rect}>
                <AnimatedGameSprite
                    animatedSprite={{
                        eventMode: 'static',
                        animationSpeed: 0.15,
                        rotation: spriteTransform.rotation,
                        scale: { x: spriteTransform.scaleX, y: spriteTransform.scaleY }
                    }}
                    textureProps={{ name: 'skeleton', imageNum: 4 }}
                    useMultiImages
                />
            </PhysicsObject>
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
