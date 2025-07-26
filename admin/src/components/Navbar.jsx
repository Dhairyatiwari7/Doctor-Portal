import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (aToken) {
            localStorage.removeItem('aToken');
            setAToken('');
            navigate('/');
        }
    };

    return (
        <nav className="relative bg-white shadow-md px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
            {/* Top-right Logout Button (Mobile Only) */}
            <div className="absolute top-2 right-2 sm:hidden z-10">
                <button
                    onClick={handleLogout}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded-full shadow-sm"
                    title="Logout"
                >
                    Logout
                </button>
            </div>

            {/* Logo & Role - Added padding-right on mobile to avoid overlap */}
            <div className="flex items-center space-x-3 pr-20 sm:pr-0 w-full sm:w-auto">
                <img src={assets.admin_logo} alt="Logo" className="h-10 w-auto" />
                <p className="border px-3 py-1 border-gray-300 bg-blue-100 text-sm rounded-full font-medium text-gray-700">
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            {/* Logout Button (Desktop Only) */}
            <button
                onClick={handleLogout}
                className="hidden sm:inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-200"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
