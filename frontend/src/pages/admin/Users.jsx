import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Users = () => {
    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:3000/api/v1/users', { withCredentials: true }).then((res) => res.data)
    });

    if (isLoading) return <p>Loading users...</p>;

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                        <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">ID</th>
                        <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">Username</th>
                        <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.users.map((user) => (
                        <tr key={user.User.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{user.User.id}</td>
                            <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{user.User.username}</td>
                            <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{user.User.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
