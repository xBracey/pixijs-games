import { create } from 'zustand';

interface PenguinThrowerStore {
    status: string;
    setStatus: (status: string) => void;
    score: number;
    setScore: (score: number | ((prev: number) => number)) => void;
    resetGame: () => void;
    penguinSpeed: number;
    setPenguinSpeed: (speed: number | ((speed: number) => number)) => void;
    mapLeft: number;
    setMapLeft: (mapLeft: number | ((mapLeft: number) => number), width: number) => void;
    revolutions: number;
}

const defaultGameValues: Partial<PenguinThrowerStore> = {
    score: 0,
    penguinSpeed: 0,
    mapLeft: 0
};

export const usePenguinThrowerStore = create<PenguinThrowerStore>()((set, get) => ({
    status: 'idle',
    setStatus: (status: string) => set({ status }),
    score: 0,
    revolutions: 0,
    setScore: (score: number | ((prev: number) => number)) =>
        set((state) => ({
            score: typeof score === 'function' ? score(state.score) : score
        })),
    resetGame: () => set({ ...defaultGameValues }),
    penguinSpeed: 0,
    setPenguinSpeed: (penguinSpeed: number | ((prev: number) => number)) =>
        set((state) => ({
            penguinSpeed: typeof penguinSpeed === 'function' ? penguinSpeed(state.penguinSpeed) : penguinSpeed
        })),
    mapLeft: 0,
    setMapLeft: (mapLeft: number | ((prev: number) => number), width: number) =>
        set((state) => {
            const newMapLeft = typeof mapLeft === 'function' ? mapLeft(state.mapLeft) : mapLeft;
            const newRevolutions = state.revolutions + (newMapLeft > width * 3 ? 1 : 0);
            const mapLeftWithCutoff = newMapLeft % (width * 3);

            return {
                mapLeft: mapLeftWithCutoff,
                revolutions: newRevolutions,
                score: Math.round(newRevolutions * width * 3 + mapLeftWithCutoff)
            };
        })
}));
