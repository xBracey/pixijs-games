import GameSprite from '@game/GameSprite';
import PhysicsObject from '@physics/PhysicsObject';
import { Pixi } from '@utils/tunnel';
import { useWorldStore } from '@utils/world';

const Player = () => {
    const { map } = useWorldStore();

    const { width: mapWidth, height: mapHeight } = map;

    return (
        <PhysicsObject
            id={'Player'}
            initialRect={{
                x: mapWidth / 2,
                y: mapWidth / 2
            }}
        >
            <GameSprite sprite={{}} textureName="" />
        </PhysicsObject>
    );
};

export default () => (
    <Pixi.In>
        <Player />
    </Pixi.In>
);
