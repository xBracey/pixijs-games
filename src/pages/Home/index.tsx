import Button from '@dom/Button';
import { Link } from '@tanstack/react-router';

export const Home = () => {
    return (
        <div>
            <div className="flex flex-col gap-8 p-4">
                <h1 className="text-center text-3xl font-bold">Tom's Arcade</h1>

                <div className="flex flex-col items-center justify-center gap-4">
                    <Button>
                        <Link to="/games/healthy-eater">Play Healthy Eater</Link>
                    </Button>
                    <Button>
                        <Link to="/games/penguin-thrower">Play Penguin Thrower</Link>
                    </Button>
                    <Button>
                        <Link to="/games/arcade-shooter">Play Arcade Shooter</Link>
                    </Button>
                    <Button>
                        <Link to="/games/tower-defence">Play Tower Defence</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
