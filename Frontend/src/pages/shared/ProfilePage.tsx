import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchCurrentUser } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { authAPI } from '../../services/api';
import { Sun, Moon, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user } = useAppSelector((s) => s.auth);
    const { theme } = useAppSelector((s) => s.theme);
    const dispatch = useAppDispatch();

    const [form, setForm] = useState({
        name: user?.name || '',
        flatNumber: user?.flatNumber || '',
    });
    const [saving, setSaving] = useState(false);

    const isDark = theme === 'dark';

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authAPI.updateProfile(form);
            await dispatch(fetchCurrentUser());
            toast.success('Profile updated');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.name
        ?.split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase() ?? '?';

    const communityName = typeof user?.communityId === 'object'
        ? user.communityId.communityName
        : '';

    return (
        <div className='flex justify-center items-center'>
            <div>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#141414] dark:text-[#EEEEEE] tracking-tight">Profile</h1>
                    <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Manage your account settings</p>
                </div>

                <div className="max-w-lg space-y-6">
                    {/* Avatar + info */}
                    <div className="card flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-[#141414] dark:bg-white flex items-center justify-center text-white dark:text-[#141414] font-bold text-xl flex-shrink-0 tracking-wide">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-[#141414] dark:text-[#EEEEEE] truncate">{user?.name}</h2>
                            <p className="text-sm text-[#8A8A8A] dark:text-[#616161] truncate">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="badge-active text-xs">{user?.role?.toLowerCase().replace('_', ' ')}</span>
                                {communityName && (
                                    <span className="text-xs text-[#8A8A8A] dark:text-[#616161]">· {communityName}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit form */}
                    <div className="card">
                        <h3 className="text-base font-bold text-[#141414] dark:text-[#EEEEEE] mb-5">Personal Information</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="input-field opacity-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Flat Number</label>
                                <input
                                    type="text"
                                    value={form.flatNumber}
                                    onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. A-101"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Theme toggle */}
                    <div className="card">
                        <h3 className="text-base font-bold text-[#141414] dark:text-[#EEEEEE] mb-4">Appearance</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#141414] dark:text-[#EEEEEE]">
                                    {isDark ? 'Dark mode' : 'Light mode'}
                                </p>
                                <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-0.5">
                                    {isDark ? 'Switch to light mode for a brighter look' : 'Switch to dark mode for less eye strain'}
                                </p>
                            </div>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${isDark ? 'bg-white' : 'bg-[#141414]'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isDark
                                            ? 'left-7 bg-[#141414]'
                                            : 'left-1 bg-white'
                                        }`}
                                >
                                    {isDark
                                        ? <Moon className="w-3.5 h-3.5 text-white" />
                                        : <Sun className="w-3.5 h-3.5 text-[#141414]" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
