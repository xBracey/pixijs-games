import { create } from 'zustand';

type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver';

interface Enemy {
    id: string;
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    speed: number;
    pathIndex: number;
    reward: number;
}

interface Tower {
    id: string;
    x: number;
    y: number;
    type: 'basic' | 'advanced' | 'super';
    damage: number;
    range: number;
    fireRate: number;
    lastShot: number;
}

interface TowerDefenceStore {
    status: GameStatus;
    setStatus: (status: GameStatus) => void;
    score: number;
    setScore: (score: number | ((prev: number) => number)) => void;
    level: number;
    setLevel: (level: number) => void;
    lives: number;
    setLives: (lives: number | ((prev: number) => number)) => void;
    money: number;
    setMoney: (money: number | ((prev: number) => number)) => void;
    enemies: Enemy[];
    setEnemies: (enemies: Enemy[] | ((prev: Enemy[]) => Enemy[])) => void;
    towers: Tower[];
    setTowers: (towers: Tower[] | ((prev: Tower[]) => Tower[])) => void;
    selectedTowerType: Tower['type'] | null;
    setSelectedTowerType: (type: Tower['type'] | null) => void;
    wave: number;
    setWave: (wave: number) => void;
    waveInProgress: boolean;
    setWaveInProgress: (inProgress: boolean) => void;
    resetGame: () => void;
}

const defaultGameValues: Partial<TowerDefenceStore> = {
    score: 0,
    level: 1,
    lives: 10,
    money: 100,
    enemies: [],
    towers: [],
    selectedTowerType: null,
    wave: 1,
    waveInProgress: false
};

export const useTowerDefenceStore = create<TowerDefenceStore>()((set) => ({
    status: 'menu',
    setStatus: (status: GameStatus) => set({ status }),
    score: 0,
    setScore: (score: number | ((prev: number) => number)) =>
        set((state) => ({
            score: typeof score === 'function' ? score(state.score) : score
        })),
    level: 1,
    setLevel: (level: number) => set({ level }),
    lives: 10,
    setLives: (lives: number | ((prev: number) => number)) =>
        set((state) => ({
            lives: typeof lives === 'function' ? lives(state.lives) : lives
        })),
    money: 100,
    setMoney: (money: number | ((prev: number) => number)) =>
        set((state) => ({
            money: typeof money === 'function' ? money(state.money) : money
        })),
    enemies: [],
    setEnemies: (enemies: Enemy[] | ((prev: Enemy[]) => Enemy[])) =>
        set((state) => ({
            enemies: typeof enemies === 'function' ? enemies(state.enemies) : enemies
        })),
    towers: [],
    setTowers: (towers: Tower[] | ((prev: Tower[]) => Tower[])) =>
        set((state) => ({
            towers: typeof towers === 'function' ? towers(state.towers) : towers
        })),
    selectedTowerType: null,
    setSelectedTowerType: (selectedTowerType: Tower['type'] | null) => set({ selectedTowerType }),
    wave: 1,
    setWave: (wave: number) => set({ wave }),
    waveInProgress: false,
    setWaveInProgress: (waveInProgress: boolean) => set({ waveInProgress }),
    resetGame: () => set({ ...defaultGameValues })
}));

export type { Enemy, Tower };