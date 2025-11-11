import Button from '../../../components/dom/Button';
import { UpgradeType, usePenguinThrowerStore } from '../store';

interface Upgrade {
    id: UpgradeType;
    name: string;
    description: string;
    cost: number;
}

const Shop = () => {
    const { backpack, maxBackpack, money, bounciness, maxBounciness, launchPower, maxLaunchPower, purchaseUpgrade, setStatus } =
        usePenguinThrowerStore();

    const upgrades: Upgrade[] = [
        {
            id: 'backpack',
            name: 'Add more jumps',
            description: `Increase number of jumps by storing more food (Current: ${backpack}x)`,
            cost: 3 * Math.pow(backpack + 1, 2)
        },
        {
            id: 'bounciness',
            name: 'Bouncier Penguins',
            description: `Increases bounciness for better rebounds (Current: ${bounciness.toFixed(2)}x)`,
            cost: 1 * Math.pow(bounciness + 1, 5)
        },
        {
            id: 'launchPower',
            name: 'Launch Power',
            description: `Increases launch speed for greater distance (Current: ${launchPower.toFixed(2)}x)`,
            cost: 4 * Math.pow(launchPower, 2.5)
        }
    ];

    const handlePurchase = (upgrade: Upgrade) => {
        if (money >= upgrade.cost) {
            purchaseUpgrade(upgrade.id, upgrade.cost);
        }
    };

    const checkMaxedOut = (upgrade: Upgrade) => {
        switch (upgrade.id) {
            case 'bounciness':
                return bounciness >= maxBounciness;
            case 'launchPower':
                return launchPower >= maxLaunchPower;
            case 'backpack':
                return backpack >= maxBackpack;
            default:
                return false;
        }
    };

    return (
        <div className="flex items-center justify-center opacity-95">
            <div className="rounded-md bg-snow-500 p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-snow-100">Penguin Shop</h1>
                        <div className="inline-block rounded-lg bg-snow-400 p-4">
                            <span className="text-2xl font-bold text-snow-100">Money: £{money.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {upgrades.map((upgrade) => {
                            const canAfford = money >= upgrade.cost;
                            const upgradeMaxedOut = checkMaxedOut(upgrade);

                            return (
                                <div
                                    key={upgrade.id}
                                    className={`rounded-lg border-2 bg-snow-400 p-6 transition-all ${
                                        canAfford && !upgradeMaxedOut
                                            ? 'border-snow-200 hover:border-snow-100'
                                            : 'pointer-events-none border-snow-500 opacity-60'
                                    }`}
                                >
                                    <div className="mb-4 text-center">
                                        <h3 className="mb-2 text-xl font-bold text-snow-100">{upgrade.name}</h3>
                                        <p className="mb-4 text-sm text-snow-200">{upgrade.description}</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-between gap-1">
                                        <span className="text-lg font-bold text-snow-100">£{upgrade.cost.toFixed(2)}</span>
                                        <Button onClick={() => handlePurchase(upgrade)}>
                                            {upgradeMaxedOut ? 'Maxed out' : canAfford ? 'Buy' : 'Not enough money'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 text-center">
                        <Button onClick={() => setStatus('throwing')}>Back to Game</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
