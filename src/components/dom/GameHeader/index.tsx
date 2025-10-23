import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import Button from '../Button';
import { Html } from '../../../utils/Html';

interface IGameHeader {
    title: string;
    children: React.ReactNode;
    menu?: React.ReactNode;
    isPlaying: boolean;
}

const GameHeader = ({ title, children, menu, isPlaying }: IGameHeader) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Html.In>
            {/* Overlay */}
            {menu && isMenuOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />}

            {/* Side Menu */}
            {menu && (
                <div
                    className={`fixed left-0 top-0 z-50 h-full w-80 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="p-4">
                        <button onClick={() => setIsMenuOpen(false)} className="mb-4 text-white hover:text-gray-300">
                            ✕ Close
                        </button>
                        {menu}
                    </div>
                </div>
            )}

            {/* Header */}
            <header
                className={`relative flex h-[80px] items-center justify-between bg-gray-900 px-4 text-white transition-opacity duration-500 ease-in-out ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : ''
                }`}
            >
                {/* Left: Burger Menu */}
                <div className="absolute left-4 flex items-center">
                    {menu && (
                        <button onClick={toggleMenu} className="rounded p-2 transition-colors hover:bg-gray-600" aria-label="Open menu">
                            <div className="mb-1 h-0.5 w-6 bg-white"></div>
                            <div className="mb-1 h-0.5 w-6 bg-white"></div>
                            <div className="h-0.5 w-6 bg-white"></div>
                        </button>
                    )}
                </div>

                {/* Center: Children */}
                <div className="flex flex-1 items-center justify-center px-4">{children}</div>

                {/* Right: Title and Back Button */}
                <div className="absolute right-4 flex items-center gap-2">
                    <h1 className="w-32 text-center text-sm font-bold">{title}</h1>
                    <Link to="/">
                        <Button>Home</Button>
                    </Link>
                </div>
            </header>
        </Html.In>
    );
};

export default GameHeader;
