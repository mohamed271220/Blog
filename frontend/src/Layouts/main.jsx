import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';
import Footer from '../components/UI/Footer';
import Header from '../components/UI/Header';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Layout = () => {
    const mode = useSelector((state) => state.theme.mode);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const root = document.documentElement;
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [mode]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCreatePost = () => {
        navigate('/post/create');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex flex-grow mt-16"> {/* Add margin-top to push main content below fixed header */}
                <Sidebar isOpen={isSidebarOpen} />
                <main className={`flex-grow p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} bg-white dark:bg-gray-900 text-black dark:text-white`}>
                    <Outlet />
                </main>
            </div>
            <Footer />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCreatePost}
                className="fixed z-50 bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            >
                <FaPlus size={24} />
            </motion.button>
        </div>
    );
};

export default Layout;
