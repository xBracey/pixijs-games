import { create } from 'zustand';

type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

interface ArcadeShooterStore {
    status: GameStatus;
    setStatus: (status: GameStatus) => void;
    score: number;
    setScore: (score: number | ((prev: number) => number)) => void;
    level: number;
    setLevel: (level: number | ((prev: number) => number)) => void;
    lives: number;
    setLives: (lives: number | ((prev: number) => number)) => void;
    enemiesKilled: number;
    setEnemiesKilled: (count: number | ((prev: number) => number)) => void;
    playerX: number;
    playerY: number;
    setPlayerPosition: (x: number, y: number) => void;
    resetGame: () => void;
}

const defaultGameValues: Partial<ArcadeShooterStore> = {
    status: 'idle',
    score: 0,
    level: 1,
    lives: 3,
    enemiesKilled: 0,
    playerX: 0,
    playerY: 0
};

export const useArcadeShooterStore = create<ArcadeShooterStore>()((set) => ({
    status: 'idle',
    setStatus: (status: GameStatus) => set({ status }),
    
    score: 0,
    setScore: (score: number | ((prev: number) => number)) =>
        set((state) => ({
            score: typeof score === 'function' ? score(state.score) : score
        })),
    
    level: 1,
    setLevel: (level: number | ((prev: number) => number)) =>
        set((state) => ({
            level: typeof level === 'function' ? level(state.level) : level
        })),
    
    lives: 3,
    setLives: (lives: number | ((prev: number) => number)) =>
        set((state) => {
            const newLives = typeof lives === 'function' ? lives(state.lives) : lives;
            return {
                lives: newLives,
                status: newLives <= 0 ? 'gameOver' : state.status
            };
        }),
    
    enemiesKilled: 0,
    setEnemiesKilled: (enemiesKilled: number | ((prev: number) => number)) =>
        set((state) => {
            const newCount = typeof enemiesKilled === 'function' ? enemiesKilled(state.enemiesKilled) : enemiesKilled;
            const shouldLevelUp = newCount > 0 && newCount % 10 === 0;
            
            return {
                enemiesKilled: newCount,
                level: shouldLevelUp ? state.level + 1 : state.level,
                score: state.score + 100
            };
        }),
    
    playerX: 0,
    playerY: 0,
    setPlayerPosition: (x: number, y: number) => set({ playerX: x, playerY: y }),
    
    resetGame: () => set({ ...defaultGameValues })
}));