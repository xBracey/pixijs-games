import { height as mapHeight, width as mapWidth } from '../../utils/map';

export const calculateRandomXY = (id: number, levelStartTimestamp: number) => {
    // Create a pseudo-random seed by combining timestamp and id
    const seed = (levelStartTimestamp % 20000) + id * 12345;
    const seed2 = (levelStartTimestamp % 20000) + id * 54321;

    // Simple pseudo-random number generator using linear congruential generator
    const random = (s: number) => {
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        return ((a * s + c) % m) / m;
    };

    const x = Math.floor(random(seed) * (mapWidth - 64));
    const y = Math.floor(random(seed2) * (mapHeight - 64));

    return { x, y };
};
