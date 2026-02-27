import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminContact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const res = await api.get("contact/get");
            setContacts(res.data.contact);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?"))
            return;

        try {
            await api.delete(`contact/delete/${id}`);
            setContacts((prev) =>
                prev.filter((contact) => contact._id !== id)
            );
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    if (loading)
        return <p className="text-center mt-10 text-lg">Loading Contacts...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Admin - Contact Messages
                </h1>

                {contacts.length === 0 ? (
                    <p className="text-gray-500">No Messages Found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Message
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {contacts.map((contact, index) => (
                                    <tr
                                        key={contact._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 text-sm">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            {contact.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {contact.email}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {contact.phone}
                                        </td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate">
                                            {contact.message}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(
                                                contact.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() =>
                                                    handleDelete(contact._id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContact;