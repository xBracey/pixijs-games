interface IHealthBar {
    health: number;
}

const maxHealth = 100;

const HealthBar = ({ health }: IHealthBar) => {
    const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));
    
    // Calculate color based on health percentage
    // Red at 0%, Green at 100%
    const red = Math.round(255 * (1 - healthPercentage / 100));
    const green = Math.round(255 * (healthPercentage / 100));
    const healthColor = `rgb(${red}, ${green}, 0)`;

    return (
        <div className="w-16 h-2 bg-gray-800 border border-gray-600 rounded-sm overflow-hidden">
            <div 
                className="h-full transition-all duration-200 ease-in-out"
                style={{
                    width: `${healthPercentage}%`,
                    backgroundColor: healthColor
                }}
            />
        </div>
    );
};

export default HealthBar;
