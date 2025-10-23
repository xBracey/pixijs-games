import { useCallback, useEffect, useRef, useState } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { AnimatedSprite, Assets, Texture } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import { useWorldStore } from '../../../../zustand/world';

extend({ AnimatedSprite });

interface IPhysicsObject {
    id: string;
    initialRect: IRect;
    animatedSprite: Omit<PixiReactElementProps<typeof AnimatedSprite>, 'textures'>;
    textureProps: { name: string; imageNum: number };
}

const PhysicsObjectAnimatedSprite = ({ id, initialRect, animatedSprite, textureProps }: IPhysicsObject) => {
    const spriteRef = useRef<AnimatedSprite>(null);
    const { paused } = useWorldStore();

    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    const [textures, setTextures] = useState<Texture[]>([Texture.EMPTY]);

    const loadTextures = useCallback(async () => {
        if (textures.length === 1) {
            const numbers = Array.from({ length: textureProps.imageNum }, (_, i) => i + 1);

            const newTextures: Texture[] = [];

            for (let index = 0; index < numbers.length; index++) {
                const number = numbers[index];

                const newTexture = await Assets.load(`/assets/${textureProps.name}/000${number}.png`);
                newTextures.push(newTexture);
            }

            setTextures(newTextures);
        }

        spriteRef.current?.play();
    }, [textures, textureProps]);

    useEffect(() => {
        loadTextures();
    }, [textures]);

    useEffect(() => {
        if (paused) {
            spriteRef.current?.stop();
        } else {
            spriteRef.current?.play();
        }
    }, [paused]);

    return (
        <pixiAnimatedSprite
            {...animatedSprite}
            ref={spriteRef}
            x={x + w / 2}
            y={y + h / 2}
            width={w}
            height={h}
            anchor={0.5}
            textures={textures}
        />
    );
};

export default PhysicsObjectAnimatedSprite;
