import { useState } from 'react';
import { User as UserIcon, Mail, Save, Lock, Camera, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/mockApi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authAPI.updateProfile({ name, bio, avatar });
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Profile header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {avatar ? <img src={avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
            {user.createdAt && (
              <p className="text-gray-400 flex items-center gap-1.5 text-sm mt-1">
                <Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === 'profile' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setTab('password')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === 'password' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Change Password
        </button>
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-8 h-8 text-gray-400" />}
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                <Camera className="w-4 h-4" /> Upload Avatar
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={250}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">{bio.length}/250 characters</p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          >
            <Save className="w-5 h-5" /> {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          >
            <Lock className="w-5 h-5" /> {savingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
}
