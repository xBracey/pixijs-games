import { useWorldStore } from '@utils/world';

const WorldOverlay = () => {
    const { rects } = useWorldStore();

    // Generate a consistent color based on the ID
    function getColorFromId(id: string) {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    return (
        <div className="absolute inset-0">
            {Object.entries(rects).map(([id, rect]) => (
                <div
                    key={id}
                    className="pointer-events-none absolute border-2"
                    style={{
                        left: rect.x,
                        top: rect.y,
                        width: rect.w,
                        height: rect.h,
                        backgroundColor: getColorFromId(id),
                        borderColor: getColorFromId(id),
                        opacity: 0.5
                    }}
                    title={`ID: ${id}`}
                />
            ))}
        </div>
    );
};

export default WorldOverlay;
