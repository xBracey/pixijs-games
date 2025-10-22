interface IButton {
    children: React.ReactNode;
    onClick?: () => void;
}

const Button = ({ children, onClick }: IButton) => {
    return (
        <button className="border-[4px] border-white p-2 px-4 text-lg font-bold transition-all hover:scale-105" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
