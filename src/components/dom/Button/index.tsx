import { twMerge } from 'tailwind-merge';

export interface IButton {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const Button = ({ children, onClick, className }: IButton) => {
    const baseClass = 'border-[4px] border-white p-2 px-4 text-lg font-bold transition-all hover:scale-105';
    const fullClass = twMerge(baseClass, className);

    return (
        <button className={fullClass} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
