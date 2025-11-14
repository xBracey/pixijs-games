import GameSprite from '@game/GameSprite';
import PhysicsObject from '@physics/PhysicsObject';
import { useTick } from '@pixi/react';
import { Pixi } from '@utils/tunnel';
import { useWorldStore } from '@utils/world';
import { useRef, useEffect, useCallback } from 'react';

const idPrefix = 'apple';

interface IApple {
    id: string | number;
    x: number;
    y: number;
    onAte: () => void;
}

const Apple = ({ id, x, y, onAte }: IApple) => {
    const hasSpawned = useRef(false);
    const initialRect = { x, y, h: 32, w: 32 };
    const { rects } = useWorldStore();
    const fullId = idPrefix + id;
    const rect = rects[fullId] ?? initialRect;

    useEffect(() => {
        if (rects[fullId]) {
            hasSpawned.current = true;
        }
    }, [rects[fullId]]);

    const checkIfAte = useCallback(() => {
        if (!rects[fullId] && hasSpawned.current) {
            onAte();
        }
    }, [rects[fullId]]);

    useTick(checkIfAte);

    return (
        <PhysicsObject id={fullId} initialRect={rect}>
            <GameSprite sprite={{ eventMode: 'static', width: 32, height: 32 }} textureName="apple" />;
        </PhysicsObject>
    );
};

const AppleWrapped = (props: IApple) => (
    <Pixi.In>
        <Apple {...props} />
    </Pixi.In>
);

export default AppleWrapped;
