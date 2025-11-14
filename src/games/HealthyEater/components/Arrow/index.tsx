import { MovementBasicDirection } from '@hooks/useMovement';
import { useTick } from '@pixi/react';
import { useWorldStore } from '@utils/world';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useHealthyEaterStore } from '../../store';
import { useSpriteRotation } from '@hooks/useSpriteRotation';
import PhysicsObject from '@physics/PhysicsObject';
import AnimatedGameSprite from '@game/AnimatedGameSprite';
import { Pixi } from '@utils/tunnel';

const idPrefix = 'apple';

interface IArrow {
    id: string | number;
    x: number;
    y: number;
    speed: number;
    direction: MovementBasicDirection;
    onRemoveArrow: () => void;
}

const Arrow = ({ id, x, y, speed, direction, onRemoveArrow }: IArrow) => {
    const hasSpawned = useRef(false);
    const { map } = useWorldStore();
    const { width: mapWidth, height: mapHeight } = map;
    const initialRect = useMemo(() => {
        if (direction === 'up') return { x, y: mapHeight - 64, h: 64, w: 16 };
        if (direction === 'down') return { x, y: 64, h: 64, w: 16 };
        if (direction === 'left') return { x: mapWidth - 64, y, h: 16, w: 64 };
        return { x: 64, y, h: 16, w: 64 };
    }, [x, y, direction]);
    const { onHit } = useHealthyEaterStore();
    const { rects, paused, world, removeRect } = useWorldStore();
    const fullId = idPrefix + id;
    const rect = rects[fullId] ?? initialRect;

    useEffect(() => {
        if (rects[fullId]) {
            hasSpawned.current = true;
        }
    }, [rects[fullId]]);

    const checkIfRemoved = useCallback(() => {
        if (!rects[fullId] && hasSpawned.current) {
            onRemoveArrow();
        }
    }, [rects[fullId]]);

    const removeArrow = useCallback(() => {
        world.remove(fullId);
        removeRect(fullId);
        onRemoveArrow();
    }, [fullId, world, onRemoveArrow, removeRect]);

    const onMove = useCallback(() => {
        if (!world.hasItem(fullId) || paused) {
            return;
        }

        const deltaX = direction === 'right' ? speed : direction === 'left' ? -speed : 0;
        const deltaY = direction === 'down' ? speed : direction === 'up' ? -speed : 0;

        const { collisions } = world.move(fullId, rect.x + deltaX, rect.y + deltaY, (_, newItem) =>
            newItem === 'skeleton' || newItem.startsWith('apple') ? 'cross' : 'bounce'
        );

        collisions.forEach((itemCollision) => {
            const name = itemCollision.other;

            if (name.startsWith('apple')) return;
            if (name.startsWith('border')) return removeArrow();
            if (name === 'skeleton') {
                onHit();
                removeArrow();
            }
        });
    }, [fullId, removeArrow, onHit]);

    useTick(checkIfRemoved);
    useTick(onMove);

    const spriteTransform = useSpriteRotation(direction);

    return (
        <PhysicsObject id={fullId} initialRect={rect}>
            <AnimatedGameSprite
                animatedSprite={{
                    eventMode: 'static',
                    animationSpeed: 0.15,
                    rotation: spriteTransform.rotation,
                    scale: { x: -spriteTransform.scaleX, y: spriteTransform.scaleY },
                    tint: 'rgb(255, 0, 98)'
                }}
                textureProps={{ name: 'arrow', imageNum: 2 }}
            />
        </PhysicsObject>
    );
};

const ArrowWrapped = (props: IArrow) => (
    <Pixi.In>
        <Arrow {...props} />
    </Pixi.In>
);

export default ArrowWrapped;
