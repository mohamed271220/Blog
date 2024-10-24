import { FaHome, FaInfoCircle, FaEnvelope, FaUserCircle, FaCalendar } from 'react-icons/fa'; // Importing icons
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    const isAuthenticated = useAuth();
    const user = useUser();

    const navItems = [
        { to: '/', label: 'Home', icon: FaHome, authRequired: false },
        { to: '/recommended', label: 'Recommended', icon: FaInfoCircle, authRequired: true },
        { to: '#contact', label: 'Contact', icon: FaEnvelope, authRequired: false },
        { to: '/categories', label: 'Categories', icon: FaCalendar, authRequired: false },
        { to: '/tags', label: 'Tags', icon: FaCalendar, authRequired: false },
    ];

    return (
        <aside
            className={`transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 p-4 bg-gradient-to-b fixed h-full`}
        >
            <div className="flex flex-col items-center mb-8">
                {isAuthenticated && (
                    <>
                        <FaUserCircle className="text-4xl mb-2" />
                        <p className="text-lg font-semibold">{user?.username}</p>
                    </>
                )}
            </div>
            <nav>
                <ul>
                    {navItems.map((item, index) => {
                        if (item.authRequired && !isAuthenticated) return null;
                        return (
                            <NavLink
                                key={index}
                                to={item.to}
                                className="flex items-center mb-4 hover:bg-gray-300 dark:hover:bg-gray-700 bg-opacity-45 p-2 rounded"
                                activeClassName="bg-blue-500 text-white"
                            >
                                <li className="flex items-center w-full">
                                    <item.icon className="mr-3" />
                                    <span className="text-lg">{item.label}</span>
                                </li>
                            </NavLink>
                        );
                    })}
                    {isAuthenticated && user?.roles.includes('admin') && (
                        <NavLink
                            key={'admin'}
                            to={'/admin'}
                            className="flex items-center mb-4 hover:bg-gray-300 dark:hover:bg-gray-700 bg-opacity-45 p-2 rounded"
                            activeClassName="bg-blue-500 text-white"
                        >
                            <li className="flex items-center w-full">
                                <FaCalendar className="mr-3" />
                                <span className="text-lg">
                                    Admin
                                </span>
                            </li>
                        </NavLink>
                    )
                    }
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;