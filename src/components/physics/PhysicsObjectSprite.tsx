import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { Sprite } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import GameSprite from '@game/GameSprite';

extend({ Sprite });

interface IPhysicsObject {
    id: string;
    initialRect: IRect;
    sprite: Omit<PixiReactElementProps<typeof Sprite>, 'texture'>;
    textureName?: string;
}

const PhysicsObjectSprite = ({ id, initialRect, sprite, textureName }: IPhysicsObject) => {
    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    return <GameSprite sprite={{ ...sprite, x, y, width: w, height: h }} textureName={textureName} />;
};

export default PhysicsObjectSprite;
