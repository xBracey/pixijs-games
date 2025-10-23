import { Pixi } from '../../../utils/Pixi';
import PhysicsObjectSprite from '../physics/PhysicsObject/PhysicsObjectSprite';
import { height as mapHeight, width as mapWidth } from '../../../utils/map';

const BORDER_THICKNESS = 20;

const Border = () => {
    // Top border: positioned above the map
    const topBorder = {
        x: -BORDER_THICKNESS,
        y: -BORDER_THICKNESS,
        w: mapWidth + 2 * BORDER_THICKNESS,
        h: BORDER_THICKNESS
    };

    // Bottom border: positioned below the map
    const bottomBorder = {
        x: -BORDER_THICKNESS,
        y: mapHeight,
        w: mapWidth + 2 * BORDER_THICKNESS,
        h: BORDER_THICKNESS
    };

    // Left border: positioned to the left of the map
    const leftBorder = {
        x: -BORDER_THICKNESS,
        y: 0,
        w: BORDER_THICKNESS,
        h: mapHeight
    };

    // Right border: positioned to the right of the map
    const rightBorder = {
        x: mapWidth,
        y: 0,
        w: BORDER_THICKNESS,
        h: mapHeight
    };

    return (
        <Pixi.In>
            <PhysicsObjectSprite 
                id={'border-up'} 
                initialRect={topBorder}
                sprite={{ tint: 0x333333, alpha: 0.5 }}
            />
            <PhysicsObjectSprite 
                id={'border-down'} 
                initialRect={bottomBorder}
                sprite={{ tint: 0x333333, alpha: 0.5 }}
            />
            <PhysicsObjectSprite 
                id={'border-left'} 
                initialRect={leftBorder}
                sprite={{ tint: 0x333333, alpha: 0.5 }}
            />
            <PhysicsObjectSprite 
                id={'border-right'} 
                initialRect={rightBorder}
                sprite={{ tint: 0x333333, alpha: 0.5 }}
            />
        </Pixi.In>
    );
};

export default Border;
