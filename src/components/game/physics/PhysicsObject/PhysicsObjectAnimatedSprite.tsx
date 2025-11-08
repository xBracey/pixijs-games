import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { AnimatedSprite, Assets, Spritesheet, SpritesheetData, Texture } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import { useWorldStore } from '../../../../zustand/world';

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

const size = 64;

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
    const { paused } = useWorldStore();

    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    const [textures, setTextures] = useState<Texture[]>([Texture.EMPTY]);

    const loadTextures = useCallback(async () => {
        if (textures.length === 1) {
            const numbers = Array.from({ length: textureProps.imageNum }, (_, i) => i + 1);

            if (useSpriteSheet) {
                const imageName = `/assets/${textureProps.name}.png`;

                const spriteSheetData: SpritesheetData = {
                    frames: Object.fromEntries(
                        numbers.map((num) => [
                            num.toString(),
                            {
                                frame: { x: (num - 1) * size, y: 0, w: size, h: size },
                                spriteSourceSize: { x: 0, y: 0, w: size, h: size },
                                sourceSize: { w: size, h: size },
                                anchor: { x: size / 2, y: size / 2 }
                            }
                        ])
                    ),
                    meta: {
                        image: imageName,
                        format: 'RGBA8888',
                        size: { w: size * textureProps.imageNum, h: size },
                        scale: '1'
                    }
                };

                const newTexture = await Assets.load(imageName);

                const spritesheet = new Spritesheet(newTexture, spriteSheetData);

                // Generate all the Textures asynchronously
                const spriteSheetTextures = await spritesheet.parse();

                setTextures(Object.values(spriteSheetTextures));
                return;
            }

            const newTextures: Texture[] = [];

            for (let index = 0; index < numbers.length; index++) {
                const number = numbers[index];

                const newTexture = await Assets.load(`/assets/${textureProps.name}/000${number}.png`);
                newTextures.push(newTexture);
            }

            setTextures(newTextures);
        }

        if (autoplay) spriteRef.current?.play();
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
