import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { BACKEND_URL, aToken, setAToken } = useContext(AdminContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        
        try {
            if (state === "Admin") {
                const response = await axios.post(`${BACKEND_URL}/api/admin/login`, { 
                    email, 
                    password 
                });
                
                const { data } = response;
                
                if (data.success) {
                    console.log("Login successful, token:", data.token);
                    setAToken(data.token);
                    localStorage.setItem('aToken', data.token);
                    toast.success(data.message || "Login successful!");
                } else {
                    toast.error(data.message || "Login failed");
                }
            } else {
                console.log('Doctor login not implemented yet');
                toast.info("Doctor login not implemented yet");
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data?.message || "Login failed";
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <p className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    <span className="text-blue-600 font-bold">{state}</span> Login
                </p>

                <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-1">Email</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                    />
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-1">Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {state === 'Admin' ? (
                    <p className="text-sm text-gray-600 text-center mt-4">
                        Doctor Login{' '}
                        <span
                            className="text-blue-600 font-medium hover:underline cursor-pointer"
                            onClick={() => setState('Doctor')}
                        >
                            Click Here
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-gray-600 text-center mt-4">
                        Admin Login{' '}
                        <span
                            className="text-blue-600 font-medium hover:underline cursor-pointer"
                            onClick={() => setState('Admin')}
                        >
                            Click Here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
