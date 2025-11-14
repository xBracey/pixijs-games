import { extend, PixiReactElementProps } from '@pixi/react';
import { IRect } from 'bump-ts';
import { Container } from 'pixi.js';
import { usePhyicsObject } from './usePhysicsObject';
import { ReactNode } from 'react';

extend({ Container });

interface IPhysicsObject {
    id: string;
    initialRect: IRect;
    children: ReactNode;
    container?: PixiReactElementProps<typeof Container>;
}

const PhysicsObject = ({ id, initialRect, children, container = {} }: IPhysicsObject) => {
    const { x, y, w, h } = usePhyicsObject(id, initialRect);

    return (
        <pixiContainer {...container} x={x} y={y} width={w} height={h}>
            {children}
        </pixiContainer>
    );
};

export default PhysicsObject;
