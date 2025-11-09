import { useEffect } from 'react';
import { extend, useTick } from '@pixi/react';
import { IRect } from 'bump-ts';
import { AnimatedSprite, Sprite } from 'pixi.js';
import { useWorldStore } from '@utils/world';

extend({ Sprite, AnimatedSprite });

export const usePhyicsObject = (id: string, initialRect: IRect) => {
    const { rects, setRect, world, paused } = useWorldStore();
    const rect = rects[id] ?? initialRect;
    const { x, y, w, h } = rect;

    useEffect(() => {
        if (!world.hasItem(id)) {
            world.add(id, x, y, w, h);
            setRect(id, rect);
        }

        return () => {
            if (world.hasItem(id)) {
                world.remove(id);
            }
        };
    }, [id]);

    useTick(() => {
        if (paused) return;

        if (!world.hasItem(id)) {
            return;
        }

        const newRect = world.getRect(id);

        if (newRect.x !== x || newRect.y !== y || newRect.w !== w || newRect.h !== h) {
            setRect(id, newRect);
        }
    });

    return rect;
};
