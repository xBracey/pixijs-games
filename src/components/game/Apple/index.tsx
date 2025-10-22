import { Pixi } from '../../../utils/Pixi';
import { useWorldStore } from '../../../zustand/world';
import { useMovement } from '../../../utils/useMovement';
import PhysicsObjectSprite from '../physics/PhysicsObject/PhysicsObjectSprite';

const idPrefix = 'apple';

interface IApple {
    id: string;
    x: number;
    y: number;
}

const Apple = ({ id, x, y }: IApple) => {
    const initialRect = { x, y, h: 32, w: 32 };
    const { rects } = useWorldStore();
    const rect = rects[id] ?? initialRect;

    useMovement(id, 2);

    return <PhysicsObjectSprite id={idPrefix + id} initialRect={rect} sprite={{ anchor: 0.5, eventMode: 'static' }} textureName="apple" />;
};

const AppleWrapped = (props: IApple) => (
    <Pixi.In>
        <Apple {...props} />
    </Pixi.In>
);

export default AppleWrapped;
