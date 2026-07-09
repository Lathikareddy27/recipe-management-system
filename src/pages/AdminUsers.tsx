import { useEffect, useState } from 'react';
import { Users as UsersIcon, Trash2, Mail, Calendar, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../api/mockApi';
import Spinner from '../components/Spinner';

interface AdminUser extends Record<string, unknown> {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  createdAt: string;
  recipeCount: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers();
      setUsers(data as AdminUser[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await adminAPI.deleteUser(confirmDelete._id);
      toast.success('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) return <Spinner size={40} className="min-h-[60vh]" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UsersIcon className="w-7 h-7 text-blue-500" /> Manage Users
        </h1>
        <p className="text-gray-500 mt-1">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Recipes</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500 md:hidden flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600 flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'admin' ? <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span> : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{u.recipeCount}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete user "{confirmDelete.name}"?</h3>
            <p className="text-gray-500 mb-6">This will permanently delete the user and all their recipes. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
