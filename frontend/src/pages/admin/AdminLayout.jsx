import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <nav className="w-1/4 p-4 bg-gray-800 dark:bg-gray-700 text-white border-r border-gray-700 dark:border-gray-600 h-screen">
            <ul>
                <li className="mb-3">
                    <Link to='/admin' className="hover:text-blue-400 dark:hover:text-blue-300">
                        Users
                    </Link>
                </li>
                <li>
                    <Link to="tags-categories" className="hover:text-blue-400 dark:hover:text-blue-300">
                        Tags & Categories
                    </Link>
                </li>
            </ul>
        </nav>
        <main className="w-3/4 m-0 p-6 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <Outlet />
        </main>
    </div>
);

export default AdminLayout;
