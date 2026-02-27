import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const { data } = await api.get(`/auth/allusers`);

            setUsers(data.users);   // ✅ FIXED
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading Users...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Manage Users
            </h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Created At</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-700">
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 font-medium">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-semibold ${user.role === "admin"
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;