import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { Container } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import { ReactNode } from 'react';
import { useWorldStore } from '@utils/world';

extend({ Container });

interface IPhysicsObject {
    id: string;
    initialRect: { x: number; y: number; w?: number; h?: number };
    children?: ReactNode;
    container?: PixiReactElementProps<typeof Container>;
}

const PhysicsObject = ({ id, initialRect, children, container = {} }: IPhysicsObject) => {
    const { gridSize } = useWorldStore();
    const fullIniitalRect: IRect = { w: gridSize, h: gridSize, ...initialRect };
    const { x, y, w, h } = usePhyicsObject(id, fullIniitalRect);

    return (
        <pixiContainer {...container} x={x} y={y} width={w} height={h}>
            {children}
        </pixiContainer>
    );
};

export default PhysicsObject;
