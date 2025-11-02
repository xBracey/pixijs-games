import { create } from 'zustand';

interface HealthyEaterStore {
    status: string;
    setStatus: (status: string) => void;
    level: number;
    setLevel: (level: number) => void;
    health: number;
    setHealth: (health: number) => void;
    onHit: () => void;
    onEat: () => void;
    foodLeft: number;
    setFoodLeft: (foodLeft: number | ((prev: number) => number)) => void;
    foodActive: number[];
    setFoodActive: (foodActive: number[] | ((prev: number[]) => number[])) => void;
    removeFoodActive: (id: number) => void;
    arrowsActive: number[];
    setArrowsActive: (arrowsActive: number[] | ((prev: number[]) => number[])) => void;
    removeArrowsActive: (id: number) => void;
    levelStartTimestamp: number | null;
    setLevelStartTimestamp: (timestamp: number | null) => void;
}

const defaultResetValues: Partial<HealthyEaterStore> = {
    foodActive: [],
    foodLeft: 0,
    arrowsActive: [],
    levelStartTimestamp: null
};

export const useHealthyEaterStore = create<HealthyEaterStore>()((set, get) => ({
    status: 'idle',
    setStatus: (status: string) => set({ status }),
    level: 1,
    setLevel: (level: number) => set({ level }),
    health: 100,
    setHealth: (health: number) => set({ health }),
    onHit: () => {
        const currentHealth = get().health;
        if (currentHealth < 30) {
            set({ health: 0, status: 'gameOver', level: 1, ...defaultResetValues });
        }
        set({ health: Math.max(0, currentHealth - 30) });
    },
    onEat: () => {
        const { health, level, foodActive, foodLeft } = get();
        console.log(foodLeft, foodActive);
        if (foodActive.length <= 1 && foodLeft === 0) {
            set({
                level: level + 1,
                status: 'nextLevel',
                ...defaultResetValues
            });
        } else {
            set({
                health: Math.min(100, health + 10)
            });
        }
    },
    foodLeft: 0,
    setFoodLeft: (foodLeft: number | ((prev: number) => number)) =>
        set((state) => ({
            foodLeft: typeof foodLeft === 'function' ? foodLeft(state.foodLeft) : foodLeft
        })),
    foodActive: [],
    setFoodActive: (foodActive: number[] | ((prev: number[]) => number[])) =>
        set((state) => ({
            foodActive: typeof foodActive === 'function' ? foodActive(state.foodActive) : foodActive
        })),
    removeFoodActive: (id: number) =>
        set((state) => ({
            foodActive: state.foodActive.filter((activeId) => activeId !== id)
        })),
    arrowsActive: [],
    setArrowsActive: (arrowsActive: number[] | ((prev: number[]) => number[])) =>
        set((state) => ({
            arrowsActive: typeof arrowsActive === 'function' ? arrowsActive(state.arrowsActive) : arrowsActive
        })),
    removeArrowsActive: (id: number) =>
        set((state) => ({
            arrowsActive: state.arrowsActive.filter((activeId) => activeId !== id)
        })),
    levelStartTimestamp: null,
    setLevelStartTimestamp: (timestamp: number | null) => set({ levelStartTimestamp: timestamp })
}));
