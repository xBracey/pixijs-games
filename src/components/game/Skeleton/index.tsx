import CenteredHTML from '../../dom/CenteredHTML';
import { Pixi } from '../../../utils/Pixi';
import PhysicsObjectAnimatedSprite from '../physics/PhysicsObject/PhysicsObjectAnimatedSprite';
import { useWorldStore } from '../../../zustand/world';
import { useMovement } from '../../../utils/useMovement';

const id = 'skeleton';
const initialRect = { x: 200, y: 200, h: 64, w: 64 };

const Skeleton = () => {
    const { rects } = useWorldStore();
    const rect = rects[id] ?? initialRect;

    useMovement(id, 2);

    return (
        <>
            <PhysicsObjectAnimatedSprite
                id={id}
                initialRect={rect}
                animatedSprite={{ anchor: 0.5, eventMode: 'static', animationSpeed: 0.15 }}
                textureProps={{ name: 'skeleton', imageNum: 4 }}
            />
            <CenteredHTML rect={rect}>
                <p className="pb-20">You</p>
            </CenteredHTML>
        </>
    );
};

const SkeletonWrapped = () => (
    <Pixi.In>
        <Skeleton />
    </Pixi.In>
);

export default SkeletonWrapped;
