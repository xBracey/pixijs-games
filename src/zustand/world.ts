import { create } from 'zustand';
import Bump, { IRect, World } from 'bump-ts';

interface IScreen {
    scale: number;
    x: number;
    y: number;
}

interface WorldStore {
    world: World;
    paused: boolean;
    setPaused: (paused: boolean) => void;
    setWorld: (world: World) => void;
    resetWorld: () => void;
    rects: { [id: string]: IRect };
    setRect: (id: string, rect: IRect) => void;
    removeRect: (id: string) => void;
    screen: IScreen;
    setScreen: (screen: IScreen) => void;
}

export const useWorldStore = create<WorldStore>((set, get) => ({
    world: Bump.newWorld(64),
    paused: false,
    setPaused: (paused: boolean) => set({ paused }),
    setWorld: (world: World) => set({ world }),
    resetWorld: () => set({ world: Bump.newWorld(64), rects: {} }),
    rects: {},
    setRect: (id: string, rect: IRect) => {
        const currentRects = get().rects;
        return set({ rects: { ...currentRects, [id]: rect } });
    },
    removeRect: (id: string) => {
        const currentRects = get().rects;
        const { [id]: removed, ...remainingRects } = currentRects;
        return set({ rects: remainingRects });
    },
    screen: { scale: 1, x: 0, y: 0 },
    setScreen: (screen: IScreen) => set({ screen })
}));
