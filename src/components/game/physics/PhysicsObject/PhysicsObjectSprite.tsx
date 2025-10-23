import { useCallback, useEffect, useRef, useState } from 'react';
import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { Assets, Sprite, Texture } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';

extend({ Sprite });

interface IPhysicsObject {
    id: string;
    initialRect: IRect;
    sprite: Omit<PixiReactElementProps<typeof Sprite>, 'texture'>;
    textureName?: string;
}

const PhysicsObjectSprite = ({ id, initialRect, sprite, textureName }: IPhysicsObject) => {
    const spriteRef = useRef<Sprite>(null);

    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    const [texture, setTexture] = useState<Texture>(Texture.EMPTY);

    const loadTexture = useCallback(async () => {
        if (texture === Texture.EMPTY && textureName) {
            const newTexture = await Assets.load(`/assets/${textureName}/0001.png`);
            setTexture(newTexture);
        }
    }, [texture, textureName]);

    useEffect(() => {
        loadTexture();
    }, [texture]);

    return <pixiSprite {...sprite} ref={spriteRef} x={x} y={y} width={w} height={h} anchor={0} texture={texture} />;
};

export default PhysicsObjectSprite;
