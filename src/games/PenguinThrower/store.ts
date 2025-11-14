import { create } from 'zustand';

type GameStatus = 'menu' | 'throwing' | 'threw' | 'shop';
export type UpgradeType = 'bounciness' | 'launchPower' | 'backpack';

const maxBounciness = 0.5;
const maxLaunchPower = 3;
const maxBackpack = 4;

interface PenguinThrowerStore {
    status: GameStatus;
    setStatus: (status: GameStatus) => void;
    score: number;
    setScore: (score: number | ((prev: number) => number)) => void;
    resetGame: () => void;
    penguinSpeed: number;
    setPenguinSpeed: (speed: number | ((speed: number) => number)) => void;
    mapLeft: number;
    setMapLeft: (mapLeft: number | ((mapLeft: number) => number), width: number) => void;
    revolutions: number;
    money: number;
    bounciness: number;
    launchPower: number;
    purchaseUpgrade: (upgradeType: UpgradeType, cost: number) => void;
    maxBounciness: number;
    maxLaunchPower: number;
    backpack: number;
    maxBackpack: number;
    launchNumber: number;
    increaseLaunchNumber: () => void;
    resetLaunchNumber: () => void;
}

const defaultGameValues: Partial<PenguinThrowerStore> = {
    score: 0,
    penguinSpeed: 0,
    mapLeft: 0,
    launchNumber: 0
};

export const usePenguinThrowerStore = create<PenguinThrowerStore>()((set) => ({
    maxBounciness,
    maxLaunchPower,
    status: 'menu',
    setStatus: (status: GameStatus) => {
        if (status === 'shop') {
            return set((state) => ({
                status,
                money: state.money + Math.round(state.score / 10) / 100,
                score: 0,
                revolutions: 0,
                mapLeft: 0
            }));
        }

        return set({ status });
    },
    score: 0,
    revolutions: 0,
    backpack: 0,
    maxBackpack,
    launchNumber: 0,
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
            if (state.status === 'shop') return state;

            const newMapLeft = typeof mapLeft === 'function' ? mapLeft(state.mapLeft) : mapLeft;
            const newRevolutions = state.revolutions + (newMapLeft > width * 3 ? 1 : 0);
            const mapLeftWithCutoff = newMapLeft % (width * 3);

            return {
                mapLeft: mapLeftWithCutoff,
                revolutions: newRevolutions,
                score: Math.round(newRevolutions * width * 3 + mapLeftWithCutoff)
            };
        }),
    money: 0,
    bounciness: 0.3,
    launchPower: 1.2,
    purchaseUpgrade: (upgradeType: UpgradeType, cost: number) => {
        return set((state) => {
            if (state.money >= cost) {
                const updates: Partial<PenguinThrowerStore> = {
                    money: state.money - cost
                };

                if (upgradeType === 'bounciness') {
                    updates.bounciness = Math.min(state.bounciness * 1.1, state.maxBounciness);
                } else if (upgradeType === 'launchPower') {
                    updates.launchPower = Math.min(state.launchPower * 1.1, state.maxLaunchPower);
                } else if (upgradeType === 'backpack') {
                    updates.backpack = Math.min(state.backpack + 1, state.maxBackpack);
                }

                return { ...state, ...updates };
            }
            return state;
        });
    },
    resetLaunchNumber: () =>
        set({
            launchNumber: 0
        }),
    increaseLaunchNumber: () =>
        set((state) => ({
            launchNumber: state.launchNumber + 1
        }))
}));
