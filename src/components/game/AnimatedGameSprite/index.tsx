import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { AnimatedSprite, Assets, Spritesheet, SpritesheetData, Texture } from 'pixi.js';
import { useWorldStore } from '@utils/world';

extend({ AnimatedSprite });

interface IAnimation {
    animatedSprite: Omit<PixiReactElementProps<typeof AnimatedSprite>, 'textures'>;
    textureProps: { name: string; imageNum: number };
    useMultiImages?: boolean;
    autoplay?: boolean;
    ref?: RefObject<AnimatedSprite | null>;
    reversable?: boolean;
}

const size = 64;

const Animation = ({ animatedSprite, textureProps, useMultiImages = false, autoplay = true, ref, reversable }: IAnimation) => {
    const spriteRef = ref ?? useRef<AnimatedSprite>(null);
    const { paused, activeGame } = useWorldStore();

    const [textures, setTextures] = useState<Texture[] | undefined>(undefined);

    const loadTextures = useCallback(async () => {
        if (!textures) {
            const numbers = Array.from({ length: textureProps.imageNum }, (_, i) => i + 1);

            if (useMultiImages) {
                const newTextures: Texture[] = [];

                for (let index = 0; index < numbers.length; index++) {
                    const number = numbers[index];

                    const newTexture = await Assets.load(`/assets/${activeGame}/${textureProps.name}/000${number}.png`);
                    newTextures.push(newTexture);
                }

                setTextures(newTextures);
                return;
            }

            const imageName = `/assets/${activeGame}/${textureProps.name}.png`;

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

        if (autoplay) spriteRef.current?.play();
    }, [textures, textureProps, activeGame]);

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

    const onComplete = () => {
        if (reversable && spriteRef.current?.animationSpeed) {
            spriteRef.current.animationSpeed = -spriteRef.current?.animationSpeed;
            spriteRef.current.play();
        }

        if (animatedSprite.onComplete) animatedSprite.onComplete();
    };

    return textures ? (
        <pixiAnimatedSprite ref={spriteRef} anchor={0} textures={textures} onComplete={onComplete} {...animatedSprite} />
    ) : null;
};

export default Animation;
