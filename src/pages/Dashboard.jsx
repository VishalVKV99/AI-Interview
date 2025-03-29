import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users function (to be reused after delete)
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);

      const usersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const userData = docSnap.data();

          // Optional: Get history count for each user
          const historyCollection = collection(db, 'users', docSnap.id, 'history');
          const historySnapshot = await getDocs(historyCollection);
          const interviewCount = historySnapshot.size;

          return {
            id: docSnap.id,
            ...userData,
            interviewCount,
          };
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user handler
  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', uid));
      alert('User deleted successfully!');
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Edit user handler placeholder
  const handleEdit = (uid) => {
    alert(`Edit functionality for user ${uid} coming soon!`);
    // You can implement an edit modal or navigate to an edit page.
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin User Dashboard</h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-lg text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Interviews</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.name || 'No Name'}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 capitalize">{user.role || 'candidate'}</td>
                  <td className="border px-4 py-2 text-center">{user.interviewCount}</td>
                  <td className="border px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
  );
};

export default Dashboard;
