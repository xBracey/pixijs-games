import { useCallback, useEffect, useRef, useState } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { Assets, Sprite, Texture } from 'pixi.js';
import { useWorldStore } from '@utils/world';

extend({ Sprite });

interface IPhysicsObject {
    sprite: Omit<PixiReactElementProps<typeof Sprite>, 'texture'>;
    textureName?: string;
}

const GameSprite = ({ sprite, textureName }: IPhysicsObject) => {
    const { activeGame } = useWorldStore();
    const spriteRef = useRef<Sprite>(null);

    const [texture, setTexture] = useState<Texture>(Texture.EMPTY);

    const loadTexture = useCallback(async () => {
        if (texture === Texture.EMPTY && textureName) {
            const newTexture = await Assets.load(`/assets/${activeGame}/${textureName}.png`);
            setTexture(newTexture);
        }
    }, [texture, textureName]);

    useEffect(() => {
        loadTexture();
    }, [texture]);

    return <pixiSprite {...sprite} ref={spriteRef} anchor={0} texture={texture} />;
};

export default GameSprite;
