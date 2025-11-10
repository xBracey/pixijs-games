import { RefObject, useRef } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { AnimatedSprite } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import Animation from '../game/Animation';

extend({ AnimatedSprite });

interface IPhysicsObject {
    id: string;
    initialRect: IRect;
    animatedSprite: Omit<PixiReactElementProps<typeof AnimatedSprite>, 'textures'>;
    textureProps: { name: string; imageNum: number };
    useSpriteSheet?: boolean;
    autoplay?: boolean;
    ref?: RefObject<AnimatedSprite | null>;
}

const PhysicsObjectAnimatedSprite = ({
    id,
    initialRect,
    animatedSprite,
    textureProps,
    useSpriteSheet = false,
    autoplay = true,
    ref
}: IPhysicsObject) => {
    const spriteRef = ref ?? useRef<AnimatedSprite>(null);

    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    return (
        <Animation
            animatedSprite={{
                ...animatedSprite,
                x: x + w / 2,
                y: y + h / 2,
                width: w,
                height: w
            }}
            ref={spriteRef}
            textureProps={textureProps}
            useSpriteSheet={useSpriteSheet}
            autoplay={autoplay}
        />
    );
};

export default PhysicsObjectAnimatedSprite;
