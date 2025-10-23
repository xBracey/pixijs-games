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
    levelStartTimestamp: number | null;
    setLevelStartTimestamp: (timestamp: number | null) => void;
}

export const useHealthyEaterStore = create<HealthyEaterStore>()((set, get) => ({
    status: 'idle',
    setStatus: (status: string) => set({ status }),
    level: 1,
    setLevel: (level: number) => set({ level }),
    health: 100,
    setHealth: (health: number) => set({ health }),
    onHit: () => {
        const currentHealth = get().health;
        set({ health: Math.max(0, currentHealth - 10) });
    },
    onEat: () => {
        const { health, foodLeft } = get();
        if (foodLeft > 0) {
            set({
                health: Math.min(100, health + 10),
                foodLeft: foodLeft - 1
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
    levelStartTimestamp: null,
    setLevelStartTimestamp: (timestamp: number | null) => set({ levelStartTimestamp: timestamp })
}));
